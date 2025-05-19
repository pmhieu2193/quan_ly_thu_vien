const ManageBookRepository = require('../repository/manage_book');
const moment = require('moment');

class ManageBookService {
  async getReaders(keyword) {
    try {
      const readers = await ManageBookRepository.getAllReaders(keyword);
      return readers.map(reader => ({
        ...reader.dataValues,
        NgayLapThe: reader.NgayLapThe ? moment(reader.NgayLapThe).format('DD/MM/YYYY') : 'N/A',
        NgayHetHan: reader.NgayHetHan ? moment(reader.NgayHetHan).format('DD/MM/YYYY') : 'N/A'
      }));
    } catch (error) {
      console.error('Error in getReaders:', error);
      throw error;
    }
  }
}

module.exports = new ManageBookService();