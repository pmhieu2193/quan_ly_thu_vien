const LibrarianRepository = require('../repository/librarian');
const QuyDinh = require('../models/regulation');

class LibrarianService {
  constructor() {
    this.librarianRepository = new LibrarianRepository();
  }

  async getDashboardData() {
    const readers = await this.librarianRepository.getAllReaders();
    return {
      totalReaders: readers.length,
      recentReaders: readers.slice(0, 5)
    };
  }

  async registerReader(readerData) {
    try {
      console.log('Received reader data:', readerData); // Debug log
  
      const regulation = await QuyDinh.findByPk(1);
      
      // Validate required fields
      if (!readerData.HoTen || !readerData.NgaySinh || !readerData.DiaChi || 
          !readerData.Email || !readerData.Loai) {
        throw new Error('Vui lòng điền đầy đủ thông tin');
      }
  
      // Validate age
      const birthDate = new Date(readerData.NgaySinh);
      const age = new Date().getFullYear() - birthDate.getFullYear();
      
      if (age < regulation.TuoiToiThieu || age > regulation.TuoiToiDa) {
        throw new Error(`Độ tuổi phải từ ${regulation.TuoiToiThieu} đến ${regulation.TuoiToiDa}`);
      }
  
      // Prepare reader data
      const ngayLapThe = new Date();
      const ngayHetHan = new Date();
      ngayHetHan.setMonth(ngayHetHan.getMonth() + regulation.ThoiHanThe);
  
      const newReader = {
        HoTen: readerData.HoTen,
        NgaySinh: birthDate,
        DiaChi: readerData.DiaChi,
        Email: readerData.Email,
        Loai: readerData.Loai,
        TrangThaiThe: 1,
        TongNo: 0,
        NgayLapThe: ngayLapThe,
        NgayHetHan: ngayHetHan,
        TinhTrangMuon: 0
      };
  
      console.log('Creating reader with data:', newReader); // Debug log
      return await this.librarianRepository.createReader(newReader);
    } catch (error) {
      console.error('Error in registerReader:', error);
      throw error;
    }
  }
}

module.exports = new LibrarianService();