const NhanVien = require('../models/staff');

class AdminRepository {
  async getLibrarians() {
    return await NhanVien.findAll({
      where: { LoaiTaiKhoan: 0 }
    });
  }

  async getAdminCount() {
    return await NhanVien.count({
      where: { LoaiTaiKhoan: 1 }
    });
  }

  async findByEmail(email) {
    return await NhanVien.findOne({
      where: { Email: email }
    });
  }

  async createLibrarian(librarianData) {
    return await NhanVien.create({
      HoTen: librarianData.HoTen,
      Email: librarianData.Email,
      MatKhau: librarianData.MatKhau,
      LoaiTaiKhoan: librarianData.LoaiTaiKhoan,
      MaQD: 1
    });
  }
}

module.exports = AdminRepository; 