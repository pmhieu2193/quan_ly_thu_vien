const librarianService = require('../services/librarian');

class LibrarianController {
  async showDashboard(req, res) {
    try {
      const dashboardData = await librarianService.getDashboardData();
      res.render('librarian/dashboard', {
        user: req.session.user,
        dashboardData: dashboardData || {}
      });
    } catch (error) {
      console.error('Dashboard error:', error);
      res.status(500).send('Internal Server Error');
    }
  }

  async showRegisterForm(req, res) {
    res.render('librarian/register-reader', {
      user: req.session.user,
      error: null,
      success: null
    });
  }

  async registerReader(req, res) {
    try {
      console.log('Form data received:', req.body); // Debug log
  
      if (!req.body.HoTen || !req.body.NgaySinh || !req.body.DiaChi || 
          !req.body.Email || !req.body.Loai) {
        throw new Error('Vui lòng điền đầy đủ thông tin');
      }
  
      const result = await librarianService.registerReader(req.body);
      
      res.render('librarian/register-reader', {
        success: 'Đăng ký độc giả mới thành công',
        error: null,
        user: req.session.user,
        formData: req.body // Return form data in case of error
      });
    } catch (error) {
      console.error('Register error:', error);
      res.render('librarian/register-reader', {
        error: error.message,
        success: null,
        user: req.session.user,
        formData: req.body // Return form data in case of error
      });
    }
  }
}

module.exports = new LibrarianController();