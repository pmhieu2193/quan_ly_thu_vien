const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('tên_database', 'tên_user', 'mật_khẩu', {
  host: 'localhost',
  dialect: 'mysql',
  logging: false, 
  define: {
    freezeTableName: true, 
  }
});

module.exports = sequelize;
