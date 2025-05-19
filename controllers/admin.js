const adminService = require('../services/admin');

class AdminController {
  async showDashboard(req, res) {
    try {
      const dashboardData = await adminService.getDashboardData(req.session.user.id);
      res.render('admin/dashboard', {
        user: req.session.user,
        dashboardData
      });
    } catch (error) {
      console.error('Dashboard error:', error);
      res.status(500).send('Internal Server Error');
    }
  }

  async showRegisterForm(req, res) {
    res.render('admin/register-librarian', {
      user: req.session.user,
      error: null,
      success: null
    });
  }

  async registerLibrarian(req, res) {
    try {
      const { hoTen, email, matKhau, xacNhanMatKhau, loaiTaiKhoan } = req.body;
  
      if (matKhau !== xacNhanMatKhau) {
        throw new Error('Mật khẩu và xác nhận mật khẩu không khớp');
      }
  
      if (parseInt(loaiTaiKhoan) === 1) {
        const adminCount = await adminService.getAdminCount();
        if (adminCount > 0) {
          throw new Error('Chỉ được phép có một tài khoản Admin');
        }
      }
  
      await adminService.registerLibrarian({
        HoTen: hoTen,
        Email: email,
        MatKhau: matKhau,
        LoaiTaiKhoan: parseInt(loaiTaiKhoan)
      });
  
      res.render('admin/register-librarian', {
        success: 'Đăng ký tài khoản mới thành công',
        error: null,
        user: req.session.user
      });
    } catch (error) {
      res.render('admin/register-librarian', {
        error: error.message,
        success: null,
        user: req.session.user
      });
    }
  }
}

module.exports = new AdminController();