const bookRepository = require('../repository/book');

class BookService {
  async getAllBooks() {
    return await bookRepository.findAll();
  }

  async getBookById(id) {
    const book = await bookRepository.findById(id);
    if (!book) throw new Error('Không tìm thấy sách');
    return book;
  }

  async searchBooks(searchQuery) {
    return await bookRepository.search(searchQuery);
  }
}

module.exports = new BookService();