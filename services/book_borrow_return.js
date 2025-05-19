const borrowRepository = require('../repository/book_borrow_return');
const moment = require('moment');

class BorrowService {
  async getRegulation() {
    return await borrowRepository.getRegulation();
  }

  async getBookInfo(maSach) {
    const book = await borrowRepository.getBookById(maSach);
    if (!book) {
      throw new Error('Không tìm thấy sách');
    }
    return book;
  }

  async createBorrow(maDG, danhSachSach) {
    const regulation = await this.getRegulation();
    
    if (danhSachSach.length > regulation.SoLuongSachMuonToiDa) {
      throw new Error(`Chỉ được mượn tối đa ${regulation.SoLuongSachMuonToiDa} cuốn`);
    }

    const ngayPhaiTra = moment().add(regulation.SoNgayMuonToiDa, 'days').format('YYYY-MM-DD');
    
    return await borrowRepository.createBorrowSlip(maDG, danhSachSach, ngayPhaiTra);
  }
}

module.exports = new BorrowService();