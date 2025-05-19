const { PhieuMuonSach, ChiTietSachMuon } = require('../models/book_borrow_return');
const Sach = require('../models/book');
const DocGia = require('../models/reader');
const QuyDinh = require('../models/regulation');
const { Op } = require('sequelize');
const sequelize = require('../shared/database');

class BorrowRepository {
  async getRegulation() {
    return await QuyDinh.findByPk(1);
  }

  async getBookById(maSach) {
    return await Sach.findByPk(maSach, {
      include: ['TheLoai']
    });
  }

  async createBorrowSlip(maDG, danhSachSach, ngayPhaiTra) {
    const t = await sequelize.transaction();
    try {
      console.log('Creating borrow slip with:', { maDG, danhSachSach, ngayPhaiTra });

      const phieuMuon = await PhieuMuonSach.create({
        MaDG: parseInt(maDG),
        NgayPhaiTra: ngayPhaiTra,
        TrangThaiMuon: 0
      }, { transaction: t });

      const chiTietMuon = danhSachSach.map(maSach => ({
        MaMS: phieuMuon.MaMS,
        MaSach: parseInt(maSach),
        TrangThaiTra: 0
      }));

      await ChiTietSachMuon.bulkCreate(chiTietMuon, { transaction: t });

      await DocGia.update(
        { TinhTrangMuon: 1 },
        { where: { MaDG: parseInt(maDG) }, transaction: t }
      );

      await t.commit();
      return phieuMuon;

    } catch (error) {
      await t.rollback();
      console.error('Transaction error:', error);
      throw error;
    }
  }
}

module.exports = new BorrowRepository();