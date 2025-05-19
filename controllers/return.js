const returnService = require('../services/return');

class ReturnController {
  async showReturnForm(req, res) {
    try {
      const maDG = req.params.id;
      const borrowedBooks = await returnService.getBorrowedBooks(maDG);

      res.render('librarian/return', {
        borrowedBooks,
        user: req.session.user
      });
    } catch (error) {
      res.status(500).send(error.message);
    }
  }

  async processReturn(req, res) {
    try {
      const { maDG, danhSachSach } = req.body;
      const result = await returnService.processReturn(maDG, danhSachSach);
      res.json({
        success: true,
        message: 'Trả sách thành công',
        data: result
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  async getBorrowedBooks(req, res) {
    try {
      const maDG = req.params.id;
      const books = await returnService.getBorrowedBooks(maDG);
      if (!books) {
        return res.status(404).json({ error: 'Không tìm thấy sách đang mượn' });
      }
      res.json(books);
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = new ReturnController();