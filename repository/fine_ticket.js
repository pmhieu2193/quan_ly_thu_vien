const { PhieuThuTienPhat } = require('../models/fine_ticket');
const DocGia = require('../models/reader');
const sequelize = require('../shared/database'); // Fix: Remove curly braces

class FineRepository {
  async getReaderFine(maDG) {
    return await DocGia.findOne({
      where: { MaDG: maDG }
    });
  }

  async createFineTicket(fineData) {
    const t = await sequelize.transaction();
    
    try {
      // Create fine ticket
      const phieuThu = await PhieuThuTienPhat.create({
        MaDG: fineData.maDG,
        MaNV: fineData.maNV,
        MaPT: fineData.maPT,
        SoTienThu: fineData.soTienThu,
        ConLai: fineData.conLai
      }, { transaction: t });

      // Update reader's total debt
      await DocGia.update(
        { TongNo: fineData.conLai },
        { 
          where: { MaDG: fineData.maDG },
          transaction: t 
        }
      );

      await t.commit();
      return phieuThu;

    } catch (error) {
      if (t) await t.rollback();
      throw error;
    }
  }
}

module.exports = new FineRepository();