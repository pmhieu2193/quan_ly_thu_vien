const { DataTypes } = require('sequelize');
const sequelize = require('../shared/database');

const regulation = sequelize.define('QuyDinh', {
  MaQD: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  TuoiToiThieu: DataTypes.INTEGER,
  TuoiToiDa: DataTypes.INTEGER,
  ThoiHanThe: DataTypes.INTEGER,
  KhoangCachNamXB: DataTypes.INTEGER,
  SoLuongSachMuonToiDa: DataTypes.INTEGER,
  SoNgayMuonToiDa: DataTypes.INTEGER
}, {
  tableName: 'QuyDinh',
  timestamps: false
});

module.exports = regulation;
