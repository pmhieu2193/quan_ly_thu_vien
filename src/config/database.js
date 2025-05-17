const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('library', 'your_username', 'your_password', {
  host: 'localhost',
  dialect: 'mysql'
});

module.exports = sequelize;
