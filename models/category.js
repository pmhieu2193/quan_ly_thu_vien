const { DataTypes } = require('sequelize');
const sequelize = require('../shared/database');

const TheLoai = sequelize.define('TheLoai', {
  MaTL: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  TenTL: DataTypes.STRING
}, {
  tableName: 'TheLoai',
  timestamps: false
});

module.exports = TheLoai;