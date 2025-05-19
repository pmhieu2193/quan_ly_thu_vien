const { DataTypes } = require('sequelize');
const sequelize = require('../shared/database');
const Sach = require('./book');

const PhieuMuonSach = sequelize.define('PhieuMuonSach', {
  MaMS: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  MaDG: DataTypes.INTEGER,
  NgayMuon: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  NgayPhaiTra: DataTypes.DATE,
  TrangThaiMuon: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  }
}, {
  tableName: 'PhieuMuonSach',
  timestamps: false
});

const ChiTietSachMuon = sequelize.define('ChiTietSachMuon', {
  MaMS: {
    type: DataTypes.INTEGER,
    primaryKey: true
  },
  MaSach: {
    type: DataTypes.INTEGER,
    primaryKey: true
  },
  TrangThaiTra: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  }
}, {
  tableName: 'ChiTietSachMuon',
  timestamps: false
});

PhieuMuonSach.hasMany(ChiTietSachMuon, {
  foreignKey: 'MaMS',
  as: 'ChiTietMuon'
});

ChiTietSachMuon.belongsTo(PhieuMuonSach, {
  foreignKey: 'MaMS'
});

ChiTietSachMuon.belongsTo(Sach, {
  foreignKey: 'MaSach',
  as: 'Sach'
});

Sach.hasMany(ChiTietSachMuon, {
  foreignKey: 'MaSach'
});

module.exports = { PhieuMuonSach, ChiTietSachMuon };