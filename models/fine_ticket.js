const { DataTypes } = require('sequelize');
const sequelize = require('../shared/database');
const DocGia = require('./reader');
const PhieuTra = require('./return').PhieuTra;
const NhanVien = require('./staff');

const PhieuThuTienPhat = sequelize.define('PhieuThuTienPhat', {
  MaPhieuThu: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  MaPT: DataTypes.INTEGER,
  MaNV: DataTypes.INTEGER,
  SoTienThu: DataTypes.INTEGER,
  ConLai: DataTypes.INTEGER,
  MaDG: DataTypes.INTEGER
}, {
  tableName: 'PhieuThuTienPhat',
  timestamps: false
});

// Add associations
PhieuThuTienPhat.belongsTo(DocGia, { foreignKey: 'MaDG' });
PhieuThuTienPhat.belongsTo(PhieuTra, { foreignKey: 'MaPT' });
PhieuThuTienPhat.belongsTo(NhanVien, { foreignKey: 'MaNV' });

module.exports = { PhieuThuTienPhat };