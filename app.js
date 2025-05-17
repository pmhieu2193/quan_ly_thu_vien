const express = require('express');
const mongoose = require('mongoose');
const bookRoutes = require('./src/routes/bookRoutes');

const app = express();
const PORT = 3000;

// Kết nối MongoDB
mongoose.connect('mongodb://localhost:27017/library')
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error(err));

app.use(express.json());

// Routes
app.use('/books', bookRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
