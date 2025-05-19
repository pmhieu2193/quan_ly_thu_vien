const { getReport1, getReport2 } = require('../services/report-statistics');

const report1 = async (req, res, next) => {
  try {
    const [year, month] = req.query.month ? req.query.month.split('-') : [new Date().getFullYear(), new Date().getMonth()+1];
    const { total, data } = await getReport1(parseInt(month), parseInt(year));
    res.render('report-statistics1', { month: req.query.month || `${year}-${String(month).padStart(2,'0')}`, total, data });
  } catch (err) { next(err); }
};

const report2 = async (req, res, next) => {
  try {
    const today = new Date();
    const date = req.query.date || today.toISOString().split('T')[0];
    
    const rows = await getReport2(date);
    res.render('report-statistics2', { 
      date,
      data: rows,
      user: req.session.user 
    });
  } catch (err) { 
    next(err); 
  }
};

module.exports = { report1, report2 };