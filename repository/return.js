const { PhieuTra, ChiTietPhieuTra } = require('../models/return');
const { PhieuMuonSach, ChiTietSachMuon } = require('../models/book_borrow_return');
const Sach = require('../models/book');
const DocGia = require('../models/reader');
const { Op } = require('sequelize');
const sequelize = require('../shared/database');

class ReturnRepository {
  async getBorrowedBooks(maDG) {
    return await PhieuMuonSach.findOne({
      where: {
        MaDG: maDG,
        TrangThaiMuon: 0
      },
      include: [{
        model: ChiTietSachMuon,
        as: 'ChiTietMuon',
        where: {
          TrangThaiTra: 0
        },
        include: [{
          model: Sach,
          as: 'Sach',
          include: ['TheLoai']
        }]
      }]
    });
  }
  async createReturnSlip(returnData) {
    const t = await sequelize.transaction();
    try {
      // 1. Create return slip
      const phieuTra = await PhieuTra.create({
        MaDG: returnData.maDG,
        MaMS: returnData.maMS,
        TongNo: returnData.tongNo,
        TienPhatKiNay: returnData.tienPhatKiNay
      }, { transaction: t });

      // 2. Create return details
      await ChiTietPhieuTra.bulkCreate(
        returnData.chiTiet.map(ct => ({
          MaPT: phieuTra.MaPT,
          MaSach: ct.MaSach,
          NgayMuon: ct.NgayMuon,
          SoNgayMuon: ct.SoNgayMuon,
          SoNgayTraTre: ct.SoNgayTraTre,
          TienPhat: ct.TienPhat
        })),
        { transaction: t }
      );

      // 3. Update book status in ChiTietSachMuon
      await ChiTietSachMuon.update(
        { TrangThaiTra: 1 },
        {
          where: {
            MaMS: returnData.maMS,
            MaSach: { [Op.in]: returnData.chiTiet.map(ct => ct.MaSach) }
          },
          transaction: t
        }
      );

      // 4. Check if all books are returned
      const remainingBooks = await ChiTietSachMuon.count({
        where: {
          MaMS: returnData.maMS,
          TrangThaiTra: 0
        },
        transaction: t
      });

      if (remainingBooks === 0) {
        // Update PhieuMuonSach status
        await PhieuMuonSach.update(
          { TrangThaiMuon: 1 },
          {
            where: { MaMS: returnData.maMS },
            transaction: t
          }
        );

        // Update DocGia status
        await DocGia.update(
          { TinhTrangMuon: 0 },
          {
            where: { MaDG: returnData.maDG },
            transaction: t
          }
        );
      }

      await t.commit();
      return { phieuTra, allBooksReturned: remainingBooks === 0 };
    } catch (error) {
      await t.rollback();
      throw error;
    }
  }
}

module.exports = new ReturnRepository();