const authService = require('../services/auth');

class AuthController {
  async login(req, res) {
    try {
      const { email, password, accountType } = req.body;
      
      const result = await authService.validateLogin(email, password, accountType);
      
      if (!result.success) {
        return res.render('login', { error: result.message });
      }

      // Initialize session
      req.session.regenerate((err) => {
        if (err) {
          console.error('Session regenerate error:', err);
          return res.render('login', { 
            error: 'Đã xảy ra lỗi, vui lòng thử lại sau'
          });
        }

        // Set session data
        req.session.user = result.user;
        req.session.save((err) => {
          if (err) {
            console.error('Session save error:', err);
            return res.render('login', { 
              error: 'Đã xảy ra lỗi, vui lòng thử lại sau'
            });
          }

          // Redirect based on account type
          if (parseInt(result.user.accountType) === 1) {
            return res.redirect('/admin/dashboard');
          } else {
            return res.redirect('/librarian/dashboard');
          }
        });
      });

    } catch (error) {
      console.error('Login error:', error);
      return res.render('login', { 
        error: 'Đã xảy ra lỗi, vui lòng thử lại sau'
      });
    }
  }

  showLoginForm(req, res) {
    res.render('login', { error: null });
  }

  logout(req, res) {
    req.session.destroy((err) => {
      if (err) {
        console.error('Logout error:', err);
      }
      res.redirect('/auth/login');
    });
  }
}

module.exports = new AuthController();