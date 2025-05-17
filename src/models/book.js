const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  MaSach: {
    type: Number,
    required: true,
    unique: true,
  },
  TenSach: {
    type: String,
    required: true,
  },
  TacGia: {
    type: String,
    required: true,
  },
  NamXuatBan: {
    type: Number,
    required: true,
  },
  TriGia: {
    type: Number,
    required: true,
  },
  img: {
    type: String,
  },
  NhaXuatBan: {
    type: String,
  },
  MoTa: {
    type: String,
  },
  MaTL: {
    type: Number,  // Có thể thay bằng ObjectId nếu bạn dùng TheLoai trong MongoDB
    required: true,
  },
  TinhTrang: {
    type: String,
    enum: ['con', 'dang muon', 'hong'],
    default: 'con',
  }
});

module.exports = mongoose.model('Book', bookSchema);