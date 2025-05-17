const express = require('express');
const session = require('express-session');
const path = require('path');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

// Import routes
const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin');
const librarianRoutes = require('./routes/librarian');

// Initialize app
const app = express();
const PORT = process.env.PORT || 3000;

// Set view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Session middleware
app.use(session({
    secret: 'library_management_secret',
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 3600000 } // 1 hour
}));

// Global middleware to make user available in all views
app.use((req, res, next) => {
    res.locals.user = req.session.user || null;
    next();
});

// Routes
app.use('/auth', authRoutes);
app.use('/admin', adminRoutes);
app.use('/librarian', librarianRoutes);

// Redirect root to login page
app.get('/', (req, res) => {
    res.redirect('/auth/login');
});

// Redirect to appropriate dashboard
app.get('/dashboard', (req, res) => {
    if (!req.session.user) {
        return res.redirect('/auth/login');
    }

    if (req.session.user.accountType === 1) {
        return res.redirect('/admin/dashboard');
    } else {
        return res.redirect('/librarian/dashboard');
    }
});

// Error handling middleware
app.use((req, res) => {
    res.status(404).send('404 - Trang không tồn tại');
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('500 - Lỗi máy chủ');
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
}); 