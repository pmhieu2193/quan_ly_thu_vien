const borrowService = require('../services/book_borrow_return');

class BorrowController {
  async showBorrowForm(req, res) {
    try {
      const maDG = req.params.id;
      const regulation = await borrowService.getRegulation();

      res.render('librarian/borrow', {
        maDG,
        regulation,
        user: req.session.user
      });
    } catch (error) {
      res.status(500).send(error.message);
    }
  }

  async getBookInfo(req, res) {
    try {
      const maSach = req.params.id;
      const book = await borrowService.getBookInfo(maSach);
      res.json(book);
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  }

  async createBorrow(req, res) {
    try {
      console.log('Received request body:', req.body);
      
      const { maDG, danhSachSach } = req.body;
      
      if (!maDG || !danhSachSach) {
        return res.status(400).json({
          error: 'Missing required data: maDG and danhSachSach are required'
        });
      }

      const result = await borrowService.createBorrow(
        parseInt(maDG), 
        danhSachSach.map(id => parseInt(id))
      );

      res.json({
        success: true,
        message: 'Mượn sách thành công',
        data: result
      });

    } catch (error) {
      console.error('Create borrow error:', error);
      res.status(500).json({
        success: false,
        error: error.message || 'Internal server error'
      });
    }
  }
}

module.exports = new BorrowController();