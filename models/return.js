const { DataTypes } = require('sequelize');
const sequelize = require('../shared/database');

const PhieuTra = sequelize.define('PhieuTra', {
  MaPT: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  MaDG: DataTypes.INTEGER,
  MaMS: DataTypes.INTEGER,
  NgayTra: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  TongNo: DataTypes.INTEGER,
  TienPhatKiNay: DataTypes.INTEGER
}, {
  tableName: 'PhieuTra',
  timestamps: false
});

const ChiTietPhieuTra = sequelize.define('ChiTietPhieuTra', {
  MaPT: {
    type: DataTypes.INTEGER,
    primaryKey: true
  },
  MaSach: {
    type: DataTypes.INTEGER,
    primaryKey: true
  },
  NgayMuon: DataTypes.DATE,
  SoNgayMuon: DataTypes.INTEGER,
  SoNgayTraTre: DataTypes.INTEGER,
  TienPhat: DataTypes.INTEGER
}, {
  tableName: 'ChiTietPhieuTra',
  timestamps: false
});

module.exports = { PhieuTra, ChiTietPhieuTra };