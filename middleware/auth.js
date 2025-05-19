const authMiddleware = {
    requireAuth(req, res, next) {
      if (!req.session || !req.session.user) {
        return res.redirect('/auth/login');
      }
      next();
    },
  
    requireAdmin(req, res, next) {
      if (!req.session || !req.session.user) {
        return res.redirect('/auth/login');
      }
      
      if (req.session.user.accountType !== 1) {
        return res.render('login', {
          error: 'Bạn không có quyền truy cập trang này'
        });
      }
      next();
    },
  
    requireLibrarian(req, res, next) {
      if (!req.session || !req.session.user) {
        return res.redirect('/auth/login');
      }
      
      if (req.session.user.accountType !== 0) {
        return res.render('login', {
          error: 'Bạn không có quyền truy cập trang này' 
        });
      }
      next();
    }
  };
  
  module.exports = authMiddleware;