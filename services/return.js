const returnRepository = require('../repository/return');
const moment = require('moment');

class ReturnService {
  async getBorrowedBooks(maDG) {
    try {
      const borrowedBooks = await returnRepository.getBorrowedBooks(maDG);
      if (!borrowedBooks) {
        throw new Error('Không tìm thấy sách đang mượn');
      }
      return borrowedBooks;
    } catch (error) {
      throw error;
    }
  }
  async processReturn(maDG, danhSachSach) {
    try {
      const borrowedBooks = await this.getBorrowedBooks(maDG);
      if (!borrowedBooks) {
        throw new Error('Không tìm thấy phiếu mượn');
      }

      const ngayHienTai = moment();
      const ngayPhaiTra = moment(borrowedBooks.NgayPhaiTra);
      
      const returnData = {
        maDG,
        maMS: borrowedBooks.MaMS,
        tongNo: 0,
        tienPhatKiNay: 0,
        chiTiet: []
      };

      danhSachSach.forEach(maSach => {
        const soNgayTre = Math.max(0, ngayHienTai.diff(ngayPhaiTra, 'days'));
        const tienPhat = soNgayTre * 1000;

        returnData.tienPhatKiNay += tienPhat;
        returnData.chiTiet.push({
          MaSach: parseInt(maSach),
          NgayMuon: borrowedBooks.NgayMuon,
          SoNgayMuon: ngayHienTai.diff(moment(borrowedBooks.NgayMuon), 'days'),
          SoNgayTraTre: soNgayTre,
          TienPhat: tienPhat
        });
      });

      const result = await returnRepository.createReturnSlip(returnData);
      return {
        success: true,
        message: `Trả sách thành công.\nTiền phạt: ${returnData.tienPhatKiNay}đ`,
        allBooksReturned: result.allBooksReturned
      };
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new ReturnService();