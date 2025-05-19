const { DataTypes } = require('sequelize');
const sequelize = require('../shared/database');

const NhanVien = sequelize.define('NhanVien', {
  MaNV: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  HoTen: DataTypes.STRING,
  Email: DataTypes.STRING,
  MatKhau: DataTypes.STRING, 
  LoaiTaiKhoan: DataTypes.INTEGER,
  MaQD: DataTypes.INTEGER
}, {
  tableName: 'NhanVien',
  timestamps: false
});

module.exports = NhanVien;