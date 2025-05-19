const fineRepository = require('../repository/fine_ticket');

class FineService {
  async getReaderFine(maDG) {
    return await fineRepository.getReaderFine(maDG);
  }

  async createFineTicket(maDG, soTienThu, maNV) {
    const reader = await this.getReaderFine(maDG);
    if (!reader) {
      throw new Error('Không tìm thấy độc giả');
    }

    if (soTienThu > reader.TongNo) {
      throw new Error('Số tiền thu không được lớn hơn tổng nợ');
    }

    const fineData = {
      maDG,
      maNV,
      soTienThu,
      conLai: reader.TongNo - soTienThu,
      maPT: null
    };

    return await fineRepository.createFineTicket(fineData);
  }
}

module.exports = new FineService();