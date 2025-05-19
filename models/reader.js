const { DataTypes } = require('sequelize');
const sequelize = require('../shared/database');

const DocGia = sequelize.define('DocGia', {
  MaDG: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  HoTen: DataTypes.STRING,
  NgaySinh: DataTypes.DATE,
  DiaChi: DataTypes.STRING,
  Email: DataTypes.STRING,
  Loai: DataTypes.STRING,
  TrangThaiThe: {
    type: DataTypes.INTEGER,
    defaultValue: 1
  },
  TongNo: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  NgayLapThe: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  NgayHetHan: DataTypes.DATE,
  TinhTrangMuon: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  }
}, {
  tableName: 'DocGia',
  timestamps: false
});

module.exports = DocGia;