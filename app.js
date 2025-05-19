const sequelize = require('./config/database');
const express = require('express');
const app = express();
const path = require('path');
const bookRoutes = require('./routes/bookRoutes');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

app.use('/api/books', bookRoutes);

// Giao diện
app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'views/index.html')));
app.get('/search', (req, res) => res.sendFile(path.join(__dirname, 'views/search.html')));
app.get('/book/:id', (req, res) => res.sendFile(path.join(__dirname, 'views/book-detail.html')));

const PORT = 3000;
app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));

// Kết nối MySQL
sequelize.authenticate()
  .then(() => {
    console.log('Kết nối MySQL thành công.');
  })
  .catch(err => {
    console.error('Kết nối MySQL thất bại:', err);
  });