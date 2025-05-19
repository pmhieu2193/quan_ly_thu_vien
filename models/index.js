const sequelize = require('../shared/database');
const { DataTypes } = require('sequelize');

// Define models
const TheLoai = sequelize.define('TheLoai', {
  MaTL: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  TenTL: DataTypes.STRING
}, { tableName: 'TheLoai', timestamps: false });

const Sach = sequelize.define('Sach', {
  MaSach: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  TenSach: DataTypes.STRING,
  MaTL: DataTypes.INTEGER
}, { tableName: 'Sach', timestamps: false });

const PhieuMuonSach = sequelize.define('PhieuMuonSach', {
  MaMS: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  NgayMuon: DataTypes.DATE
}, { tableName: 'PhieuMuonSach', timestamps: false });

const ChiTietSachMuon = sequelize.define('ChiTietSachMuon', {
  MaMS: { type: DataTypes.INTEGER, primaryKey: true },
  MaSach: { type: DataTypes.INTEGER, primaryKey: true }
}, { tableName: 'ChiTietSachMuon', timestamps: false });

const PhieuTra = sequelize.define('PhieuTra', {
  MaPT: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  MaMS: DataTypes.INTEGER
}, { tableName: 'PhieuTra', timestamps: false });

const ChiTietPhieuTra = sequelize.define('ChiTietPhieuTra', {
  MaPT: { type: DataTypes.INTEGER, primaryKey: true },
  MaSach: { type: DataTypes.INTEGER, primaryKey: true },
  NgayMuon: DataTypes.DATE,
  SoNgayTraTre: DataTypes.INTEGER
}, { tableName: 'ChiTietPhieuTra', timestamps: false });

TheLoai.hasMany(Sach, { foreignKey: 'MaTL', as: 'saches' });
Sach.belongsTo(TheLoai, { foreignKey: 'MaTL', as: 'theLoai' });

Sach.hasMany(ChiTietSachMuon, { foreignKey: 'MaSach', as: 'chiTietMuon' });
ChiTietSachMuon.belongsTo(Sach, { foreignKey: 'MaSach', as: 'sach' });

PhieuMuonSach.hasMany(ChiTietSachMuon, { foreignKey: 'MaMS', as: 'chiTietMuon' });
ChiTietSachMuon.belongsTo(PhieuMuonSach, { foreignKey: 'MaMS', as: 'phieuMuon' });

PhieuMuonSach.hasMany(PhieuTra, { foreignKey: 'MaMS', as: 'phieuTra' });
PhieuTra.belongsTo(PhieuMuonSach, { foreignKey: 'MaMS', as: 'phieuMuon' });

PhieuTra.hasMany(ChiTietPhieuTra, { foreignKey: 'MaPT', as: 'chiTietTra' });
ChiTietPhieuTra.belongsTo(PhieuTra, { foreignKey: 'MaPT', as: 'phieuTra' });

Sach.hasMany(ChiTietPhieuTra, { foreignKey: 'MaSach', as: 'chiTietTraSach' });
ChiTietPhieuTra.belongsTo(Sach, { foreignKey: 'MaSach', as: 'sach' });

module.exports = {
  sequelize,
  TheLoai,
  Sach,
  PhieuMuonSach,
  ChiTietSachMuon,
  PhieuTra,
  ChiTietPhieuTra
};