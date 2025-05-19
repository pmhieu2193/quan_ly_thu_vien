// app.js
const express = require('express');
const session = require('express-session');
const authMiddleware = require('./middleware/auth');
require('dotenv').config();

const app = express();
const path = require('path');
const bodyParser = require('express').urlencoded({ extended: true });

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views')); 
app.use(express.static('public'));
app.use(bodyParser);

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    maxAge: 24 * 60 * 60 * 1000
  }
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/book');
const adminRoutes = require('./routes/admin');
const regulationRoutes = require('./routes/regulation'); 
const reportRoutes = require('./routes/report-statistics');
const librarianRoutes = require('./routes/librarian');
const manageBookRoutes = require('./routes/manage_book');
const bookBorrowReturnRoutes = require('./routes/book_borrow_return');
const returnRoutes = require('./routes/return');
const fineTicketRoutes = require('./routes/fine_ticket');

app.use('/', userRoutes);
app.use('/auth', authRoutes);

app.use('/admin', authMiddleware.requireAdmin, adminRoutes);
app.use('/admin/regulation', regulationRoutes);
app.use('/admin/reports', reportRoutes);
app.use('/librarian', authMiddleware.requireLibrarian, librarianRoutes);
app.use('/librarian/manage_book', authMiddleware.requireLibrarian, manageBookRoutes);
app.use('/librarian/book_borrow_return', authMiddleware.requireLibrarian, bookBorrowReturnRoutes);
app.use('/librarian/return', authMiddleware.requireLibrarian, returnRoutes);
app.use('/librarian/fine', authMiddleware.requireLibrarian, fineTicketRoutes);

app.listen(3000, () => {
  console.log('Server chạy tại http://localhost:3000');
});
