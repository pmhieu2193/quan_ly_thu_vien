const { DataTypes } = require('sequelize');
const sequelize = require('../shared/database');
const TheLoai = require('./category');

const Sach = sequelize.define('Sach', {
  MaSach: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  TenSach: DataTypes.STRING,
  TacGia: DataTypes.STRING,
  NamXuatBan: DataTypes.INTEGER,
  TriGia: DataTypes.INTEGER,
  img: DataTypes.STRING,
  NhaXuatBan: DataTypes.STRING,
  MoTa: DataTypes.STRING,
  MaTL: DataTypes.INTEGER
}, {
  tableName: 'Sach',
  timestamps: false
});

// Define associations
Sach.belongsTo(TheLoai, {
  foreignKey: 'MaTL',
  as: 'TheLoai'
});

TheLoai.hasMany(Sach, {
  foreignKey: 'MaTL',
  as: 'Sach'
});

module.exports = Sach;