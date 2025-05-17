const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Book = sequelize.define('Book', {
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  author: {
    type: DataTypes.STRING
  },
  publishedYear: {
    type: DataTypes.INTEGER
  }
}, {
  tableName: 'Books',
  timestamps: false
});

module.exports = Book;
