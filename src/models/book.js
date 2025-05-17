const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Sach = sequelize.define('Book', {
  MaSach: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  TenSach: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  TacGia: {
    type: DataTypes.STRING(100),
    allowNull: true,
  },
  NamXuatBan: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  TriGia: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  img: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  NhaXuatBan: {
    type: DataTypes.STRING(45),
    allowNull: true,
  },
  MoTa: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  MaTL: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'TheLoai', // tên bảng TheLoai
      key: 'MaTL'
    }
  }
}, {
  tableName: 'Sach',
  timestamps: false,
});

module.exports = Sach;
