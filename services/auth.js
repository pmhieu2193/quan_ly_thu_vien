const NhanVien = require('../models/staff');

class AuthService {
  async validateLogin(email, password, accountType) {
    try {
      const user = await NhanVien.findOne({
        where: { Email: email }
      });

      if (!user) {
        return {
          success: false,
          message: 'Email hoặc mật khẩu không đúng',
          user: null
        };
      }


      if (parseInt(user.LoaiTaiKhoan) !== parseInt(accountType)) {
        if (parseInt(accountType) === 1) {
          return {
            success: false,
            message: 'Bạn không có quyền truy cập trang quản lý'
          };
        }
        return {
          success: false, 
          message: 'Vui lòng đăng nhập đúng loại tài khoản'
        };
      }

      if (user.MatKhau !== password) {
        return {
          success: false,
          message: 'Email hoặc mật khẩu không đúng'
        };
      }

      return {
        success: true,
        message: 'Đăng nhập thành công',
        user: {
          id: user.MaNV,
          name: user.HoTen,
          email: user.Email,
          accountType: user.LoaiTaiKhoan
        }
      };
    } catch (error) {
      console.error('Login validation error:', error);
      throw error;
    }
  }
}

module.exports = new AuthService();