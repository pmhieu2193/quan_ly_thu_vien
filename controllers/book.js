const bookService = require('../services/book');

class BookController {
  async showIndex(req, res) {
    try {
      const books = await bookService.getAllBooks();
      res.render('user/index', { books });
    } catch (error) {
      res.status(500).render('error', { error: error.message });
    }
  }

  async searchBooks(req, res) {
    try {
      const books = await bookService.searchBooks(req.query);
      // Return JSON for API requests only
      if (req.xhr || req.path.includes('/api/')) {
        return res.json(books);
      }
      // Otherwise render the page
      res.render('user/index', { books });
    } catch (error) {
      if (req.xhr || req.path.includes('/api/')) {
        return res.status(500).json({ error: error.message });
      }
      res.status(500).render('error', { error: error.message });
    }
  }

  async getBookDetail(req, res) {
    try {
      const book = await bookService.getBookById(req.params.id);
      if (!book) {
        return res.status(404).render('user/book-detail', { 
          error: { message: 'Không tìm thấy sách' }
        });
      }
      res.render('user/book-detail', { book });
    } catch (error) {
      res.render('user/book-detail', { 
        error: { message: error.message }
      });
    }
  }

  async getBookById(req, res) {
    try {
      const book = await bookService.getBookById(req.params.id);
      res.json(book);
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  }
}

module.exports = new BookController();