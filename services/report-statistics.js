const { Sequelize, Op } = require('sequelize');
const {
  ChiTietSachMuon,
  PhieuMuonSach,
  TheLoai,
  ChiTietPhieuTra,
  PhieuTra,
  Sach
} = require('../models');

async function getReport1(month, year) {
  const total = await ChiTietSachMuon.count({
    include: [{
      model: PhieuMuonSach, as: 'phieuMuon', where: Sequelize.and(
        Sequelize.where(Sequelize.fn('MONTH', Sequelize.col('phieuMuon.NgayMuon')), month),
        Sequelize.where(Sequelize.fn('YEAR', Sequelize.col('phieuMuon.NgayMuon')), year)
      ), required: true
    }]
  });

  const rows = await ChiTietSachMuon.findAll({
    attributes: [
      [Sequelize.col('sach.theLoai.TenTL'), 'TenTL'],
      [Sequelize.fn('COUNT', Sequelize.col('ChiTietSachMuon.MaSach')), 'SoLuotMuon'],
      [Sequelize.literal(`ROUND(COUNT(ChiTietSachMuon.MaSach) * 100.0 / ${total || 1}, 2)`), 'TyLe']
    ],
    include: [
      { model: PhieuMuonSach, as: 'phieuMuon', attributes: [], required: true },
      { model: Sach, as: 'sach', attributes: [], include: [{ model: TheLoai, as: 'theLoai', attributes: [] }] }
    ],
    where: Sequelize.and(
      Sequelize.where(Sequelize.fn('MONTH', Sequelize.col('phieuMuon.NgayMuon')), month),
      Sequelize.where(Sequelize.fn('YEAR', Sequelize.col('phieuMuon.NgayMuon')), year)
    ),
    group: ['sach.theLoai.MaTL'],
    order: [[Sequelize.literal('SoLuotMuon'), 'DESC']]
  });

  return {
    total,
    data: rows.map(r => ({
      TenTL: r.get('TenTL'),
      SoLuotMuon: r.get('SoLuotMuon'),
      TyLe: r.get('TyLe')
    }))
  };
}

async function getReport2(date) {
  const selectedDate = new Date(date);
  
  const rows = await ChiTietPhieuTra.findAll({
    attributes: ['NgayMuon', 'SoNgayTraTre'],
    where: { 
      SoNgayTraTre: { [Op.gt]: 0 },
      NgayMuon: {
        [Op.eq]: selectedDate
      }
    },
    include: [
      { 
        model: Sach,
        as: 'sach',
        attributes: ['TenSach']
      }
    ],
    order: [['SoNgayTraTre', 'DESC']]
  });

  return rows.map(r => ({
    TenSach: r.sach.TenSach,
    NgayMuon: r.NgayMuon,
    SoNgayTraTre: r.SoNgayTraTre
  }));
}
module.exports = { getReport1, getReport2 };