const service = require('../services/regulation');

const showChangePage = async (req, res) => {
  try {
    const regulation = await service.getCurrentRegulation();
    res.render('admin/change-regulation', { 
      regulation,
      user: req.session.user 
    });
  } catch (err) {
    res.status(500).send('Có lỗi xảy ra: ' + err.message);
  }
};

const handleChange = async (req, res) => {
  try {
    await service.changeRegulation(req.body);
    res.redirect('/admin/regulation');
  } catch (err) {
    res.render('admin/change-regulation', {
      error: err.message,
      regulation: req.body,
      user: req.session.user
    });
  }
};

module.exports = {
  showChangePage,
  handleChange
};