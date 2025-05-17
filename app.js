const express = require('express');
const sequelize = require('./src/config/database');
const bookRoutes = require('./src/routes/bookRoutes');

const app = express();
const PORT = 3000;

app.use(express.json());

// Kết nối MySQL
sequelize.authenticate()
  .then(() => {
    console.log('MySQL connected');
    return sequelize.sync(); // tự động tạo bảng nếu chưa có
  })
  .then(() => {
    console.log('Database synchronized');
  })
  .catch(err => {
    console.error('Unable to connect to MySQL:', err);
  });

// Routes
app.use('/books', bookRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
