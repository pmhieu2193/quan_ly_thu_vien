const manageBookService = require('../services/manage_book');

class ManageBookController {
  async showUserPage(req, res) {
    try {
      const keyword = req.query.name || '';
      const readers = await manageBookService.getReaders(keyword);
      
      res.render('librarian/manage_book', { 
        readers,
        keyword,
        user: req.session.user,
        searchMessage: readers.length === 0 ? 'Không tìm thấy độc giả' : ''
      });
    } catch (error) {
      console.error('Error:', error);
      res.status(500).send('Internal Server Error');
    }
  }
}

module.exports = new ManageBookController();