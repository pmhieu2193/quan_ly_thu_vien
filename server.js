const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const path = require("path");
const { console } = require("inspector");

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());
app.use(express.static("views")); // nơi chứa user.html

// Trả file user.html mặc định nếu truy cập "/"
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "user.html"));
});

// Kết nối MySQL
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "123456",
  database: "quanlythuvien"
});

db.connect(err => {
  if (err) throw err;
  console.log("Đã kết nối MySQL");
});

// API tìm kiếm độc giả
app.get("/search", (req, res) => {
  const keyword = req.query.name || "";
  const sql = `
    SELECT MaDG, HoTen, Email, Loai, TrangThaiThe, TongNo,
           DATE_FORMAT(NgayLapThe, '%Y-%m-%d %H:%i:%s') AS NgayLapThe,
           DATE_FORMAT(NgayHetHan, '%Y-%m-%d') AS NgayHetHan, TinhTrangMuon
    FROM DocGia
    WHERE HoTen LIKE ?;
  `;
  db.query(sql, [`%${keyword}%`], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// API: Lấy quy định từ bảng QuyDinh
app.get('/quydinh', (req, res) => {
  const sql = `SELECT SoLuongSachMuonToiDa, SoNgayMuonToiDa FROM QuyDinh WHERE MaQD = 1`;
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results[0]);
  });
});

// API: Lấy thông tin sách theo id
app.get('/sach/:id', (req, res) => {
  const id = req.params.id;
  const sql = `
    SELECT s.MaSach, s.TenSach, s.TacGia, s.NamXuatBan, tl.TenTL
    FROM Sach s
    JOIN TheLoai tl ON s.MaTL = tl.MaTL
    WHERE s.MaSach = ?
  `;
  db.query(sql, [id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length === 0) return res.json({});
    res.json(results[0]);
  });
});


// API tạo phiếu mượn mới
app.post("/muon-sach", async (req, res) => {
  const { madg, danhSach } = req.body;

  console.log("Mã độc giả:", madg);
  console.log("Danh sách mã sách:", danhSach);
  
  const sqlSoNgay = `SELECT SoNgayMuonToiDa FROM QuyDinh WHERE MaQD = 1`;

  db.query(sqlSoNgay, (err, results) => {
    if (err) {
      console.error("Lỗi truy vấn QuyDinh:", err);
      return res.status(500).send("Lỗi khi lấy số ngày mượn tối đa.");
    }

    if (results.length === 0) {
      return res.status(404).send("Không tìm thấy quy định mượn sách.");
    }

    const soNgay = results[0].SoNgayMuonToiDa;
    console.log("Số ngày mượn tối đa:", soNgay);

    // Tạo phiếu mượn
    const sqlInsertPhieu = `
      INSERT INTO PhieuMuonSach (MaDG, NgayPhaiTra, TrangThaiMuon)
      VALUES (?, DATE_ADD(CURRENT_DATE, INTERVAL ? DAY), 0)
    `;

    db.query(sqlInsertPhieu, [madg, soNgay], (err, resultPhieu) => {
      if (err) {
        console.error("Lỗi tạo phiếu mượn:", err);
        return res.status(500).send("Lỗi khi tạo phiếu mượn.");
      }

      const maMS = resultPhieu.insertId;

      // Thêm chi tiết sách tuần tự (dùng đệ quy hoặc Promise chain)
      const insertChiTiet = (index) => {
        if (index >= danhSach.length) {
          // Sau khi thêm hết chi tiết, cập nhật TinhTrangMuon
          const sqlCapNhatDocGia = `
            UPDATE DocGia SET TinhTrangMuon = 1 WHERE MaDG = ?
          `;
          db.query(sqlCapNhatDocGia, [madg], (err) => {
            if (err) {
              console.error("Lỗi cập nhật TinhTrangMuon:", err);
              return res.status(500).send("Đã thêm chi tiết sách nhưng lỗi khi cập nhật trạng thái độc giả.");
            }

            return res.send(`Đã mượn ${danhSach.length} sách cho độc giả ${madg}`);
          });

          return;
        }

        const maSach = danhSach[index];
        const sqlChiTiet = `
          INSERT INTO ChiTietSachMuon (MaMS, MaSach, TrangThaiTra)
          VALUES (?, ?, 0)
        `;

        db.query(sqlChiTiet, [maMS, maSach], (err) => {
          if (err) {
            console.error(`Lỗi thêm chi tiết sách mã ${maSach}:`, err);
            return res.status(500).send(`Lỗi khi thêm chi tiết mượn sách mã ${maSach}`);
          }

          insertChiTiet(index + 1); // Đệ quy đến sách tiếp theo
        });
      };

      insertChiTiet(0); // Bắt đầu thêm từ sách đầu tiên
    });
  }); 
});


// API lấy danh sách sách đang mượn chưa trả của 1 độc giả
app.get('/api/tra-sach', (req, res) => {
  const maDG = req.query.madg;
  const sql = `
    SELECT s.MaSach, s.TenSach, s.TacGia, s.NamXuatBan, 
           tl.TenTL, ct.TrangThaiTra, p.NgayPhaiTra
    FROM PhieuMuonSach p
    JOIN ChiTietSachMuon ct ON p.MaMS = ct.MaMS
    JOIN Sach s ON ct.MaSach = s.MaSach
    JOIN TheLoai tl ON s.MaTL = tl.MaTL
    WHERE p.MaDG = ? AND p.TrangThaiMuon = 0
  `;
  
  db.query(sql, [maDG], (err, results) => {
    if (err) {
      console.error('Lỗi query:', err);
      res.status(500).send('Lỗi truy vấn database');
      return;
    }
    res.json(results);
  });
});

//API Xác nhận trả sách
app.post('/xac-nhan-tra-sach', async (req, res) => {
  const { madg, danhSach } = req.body;
  console.log("Mã độc giả:", madg);
  console.log("Danh sách mã sách:", danhSach);

  // Bắt đầu transaction
  db.beginTransaction(async (err) => {
    if (err) {
      console.error("Lỗi begin transaction:", err);
      return res.status(500).send("Lỗi khi bắt đầu transaction");
    }

    try {
      // 1. Lấy thông tin phiếu mượn và sách
      const [phieuMuon] = await db.promise().query(
        `SELECT p.MaMS, p.NgayMuon, p.NgayPhaiTra, s.MaSach, s.TenSach, 
                ct.TrangThaiTra, tl.TenTL
         FROM PhieuMuonSach p
         JOIN ChiTietSachMuon ct ON p.MaMS = ct.MaMS 
         JOIN Sach s ON ct.MaSach = s.MaSach
         JOIN TheLoai tl ON s.MaTL = tl.MaTL
         WHERE p.MaDG = ? AND p.TrangThaiMuon = 0`,
        [madg]
      );

      if (phieuMuon.length === 0) {
        throw new Error("Không tìm thấy phiếu mượn");
      }

      const maMS = phieuMuon[0].MaMS;
      const ngayMuon = phieuMuon[0].NgayMuon;
      const ngayPhaiTra = phieuMuon[0].NgayPhaiTra;

      // 2. Cập nhật trạng thái sách đã trả
      for (const maSach of danhSach) {
        await db.promise().query(
          `UPDATE ChiTietSachMuon SET TrangThaiTra = 1 
           WHERE MaMS = ? AND MaSach = ?`,
          [maMS, maSach]
        );
      }

      // 3. Kiểm tra và tính tiền phạt
      const ngayHienTai = new Date();
      const ngayPhaiTraDate = new Date(ngayPhaiTra);
      let tongTienPhat = 0;

      // Tạo phiếu trả
      const [ptResult] = await db.promise().query(
        `INSERT INTO PhieuTra (MaDG, MaMS, TongNo, TienPhatKiNay) 
         VALUES (?, ?, 0, 0)`,
        [madg, maMS]
      );
      const maPT = ptResult.insertId;

      // Xử lý từng sách
      for (const maSach of danhSach) {
        const soNgayTre = Math.max(0, Math.floor((ngayHienTai - ngayPhaiTraDate) / (1000 * 60 * 60 * 24)));
        const tienPhat = soNgayTre * 1000; // 1000đ/ngày
        tongTienPhat += tienPhat;

        // Thêm chi tiết phiếu trả
        await db.promise().query(
          `INSERT INTO ChiTietPhieuTra (MaPT, MaSach, NgayMuon, SoNgayMuon, 
                                       SoNgayTraTre, TienPhat)
           VALUES (?, ?, ?, ?, ?, ?)`,
          [maPT, maSach, ngayMuon, 
           Math.floor((ngayHienTai - new Date(ngayMuon)) / (1000 * 60 * 60 * 24)),
           soNgayTre, tienPhat]
        );
      }

      // 4. Cập nhật tổng nợ độc giả
      const [[docGia]] = await db.promise().query(
        `SELECT TongNo FROM DocGia WHERE MaDG = ?`,
        [madg]
      );
      const tongNoMoi = (docGia.TongNo || 0) + tongTienPhat;

      await db.promise().query(
        `UPDATE DocGia SET TongNo = ? WHERE MaDG = ?`,
        [tongNoMoi, madg]
      );

      // 5. Cập nhật phiếu trả
      await db.promise().query(
        `UPDATE PhieuTra SET TongNo = ?, TienPhatKiNay = ? WHERE MaPT = ?`,
        [tongNoMoi, tongTienPhat, maPT]
      );

      // 6. Kiểm tra và cập nhật trạng thái mượn
      const [chuaTra] = await db.promise().query(
        `SELECT COUNT(*) AS SoChuaTra 
         FROM ChiTietSachMuon 
         WHERE MaMS = ? AND TrangThaiTra = 0`,
        [maMS]
      );

      if (chuaTra[0].SoChuaTra === 0) {
        await db.promise().query(
          `UPDATE PhieuMuonSach SET TrangThaiMuon = 1 WHERE MaMS = ?`,
          [maMS]
        );
        await db.promise().query(
          `UPDATE DocGia SET TinhTrangMuon = 0 WHERE MaDG = ?`,
          [madg]
        );
      }

      // Commit transaction
      await new Promise((resolve, reject) => {
        db.commit(err => {
          if (err) reject(err);
          resolve();
        });
      });

      const message = `Đã trả ${danhSach.length} sách thành công.\n` +
                     `Tiền phạt kỳ này: ${tongTienPhat}đ\n` +
                     `Tổng nợ: ${tongNoMoi}đ`;
      res.send(message);

    } catch (error) {
      console.error("Lỗi xử lý:", error);
      await new Promise(resolve => db.rollback(resolve));
      res.status(500).send(error.message || "Lỗi khi xử lý yêu cầu");
    }
  });
});

app.post('/tao-phieu-phat', async (req, res) => {
  const { madg, danhSach } = req.body;

  db.beginTransaction(async (err) => {
    if (err) {
      console.error("Lỗi begin transaction:", err);
      return res.status(500).send("Lỗi khi bắt đầu transaction");
    }

    try {
      // 1. Lấy thông tin phiếu mượn và sách
      const [phieuMuon] = await db.promise().query(
        `SELECT p.MaMS, p.NgayMuon, p.NgayPhaiTra, s.MaSach, s.TenSach, 
                ct.TrangThaiTra, tl.TenTL
         FROM PhieuMuonSach p
         JOIN ChiTietSachMuon ct ON p.MaMS = ct.MaMS 
         JOIN Sach s ON ct.MaSach = s.MaSach
         JOIN TheLoai tl ON s.MaTL = tl.MaTL
         WHERE p.MaDG = ? AND p.TrangThaiMuon = 0`,
        [madg]
      );

      if (phieuMuon.length === 0) {
        throw new Error("Không tìm thấy phiếu mượn");
      }

      const maMS = phieuMuon[0].MaMS;
      const ngayMuon = phieuMuon[0].NgayMuon;
      const ngayPhaiTra = phieuMuon[0].NgayPhaiTra;

      // 2. Cập nhật trạng thái sách đã trả (trạng thái làm mất)
      for (const maSach of danhSach) {
        await db.promise().query(
          `UPDATE ChiTietSachMuon SET TrangThaiTra = 2 
           WHERE MaMS = ? AND MaSach = ?`,
          [maMS, maSach]
        );
      }

      // Get the total value of lost books
      const [rows] = await db.promise().query(
        `SELECT CAST(SUM(TriGia) AS SIGNED) AS TongTriGia 
         FROM Sach WHERE MaSach IN (?)`,
        [danhSach]
      );
      
      let tongTienPhat = parseInt(rows[0].TongTriGia || 0);

      // Create return receipt with initial values
      const [ptResult] = await db.promise().query(
        `INSERT INTO PhieuTra (MaDG, MaMS, TongNo, TienPhatKiNay) 
         VALUES (?, ?, 0, ?)`,
        [madg, maMS, tongTienPhat]
      );
      const maPT = ptResult.insertId;
      const soNgayTraTre = 0;
      const tienPhat = 0;
      const SoNgayMuon = 0;

      for (const maSach of danhSach) {
        // Thêm chi tiết phiếu trả
        await db.promise().query(
          `INSERT INTO ChiTietPhieuTra (MaPT, MaSach, NgayMuon, SoNgayMuon, 
                                       SoNgayTraTre, TienPhat)
           VALUES (?, ?, ?, ?, ?, ?)`,
          [maPT, maSach, ngayMuon, 
           SoNgayMuon, soNgayTraTre, tienPhat]
        );
      }

      // 4. Cập nhật tổng nợ độc giả
      const [[docGia]] = await db.promise().query(
        `SELECT CAST(TongNo AS SIGNED) as TongNo FROM DocGia WHERE MaDG = ?`,
        [madg]
      );
      const tongNoMoi = parseInt(docGia.TongNo || 0) + tongTienPhat;

      // Update DocGia with new total debt
      await db.promise().query(
        `UPDATE DocGia SET TongNo = ? WHERE MaDG = ?`,
        [tongNoMoi, madg]
      );

      // Update PhieuTra with final values
      await db.promise().query(
        `UPDATE PhieuTra SET TongNo = ?, TienPhatKiNay = ? WHERE MaPT = ?`,
        [tongNoMoi, tongTienPhat, maPT]
      );

      // 6. Kiểm tra và cập nhật trạng thái mượn
      const [chuaTra] = await db.promise().query(
        `SELECT COUNT(*) AS SoChuaTra 
         FROM ChiTietSachMuon 
         WHERE MaMS = ? AND TrangThaiTra = 0`,
        [maMS]
      );

      if (chuaTra[0].SoChuaTra === 0) {
        await db.promise().query(
          `UPDATE PhieuMuonSach SET TrangThaiMuon = 1 WHERE MaMS = ?`,
          [maMS]
        );
        await db.promise().query(
          `UPDATE DocGia SET TinhTrangMuon = 0 WHERE MaDG = ?`,
          [madg]
        );
      }
      // Commit transaction
      await new Promise((resolve, reject) => {
        db.commit(err => {
          if (err) reject(err);
          resolve();
        });
      });

      const message = `Đã bồi thường ${danhSach.length} sách thành công.\n` +
                     `Tổng nợ: ${tongNoMoi}đ`;
      res.send(message);

    } catch (error) {
      console.error("Lỗi xử lý:", error);
      await new Promise(resolve => db.rollback(resolve));
      res.status(500).send(error.message || "Lỗi khi xử lý yêu cầu");
    }
  });

})

// API lấy thông tin độc giả
app.get('/api/docgia/:id', (req, res) => {
    const maDG = req.params.id;
    const sql = `
        SELECT MaDG, HoTen, TongNo
        FROM DocGia
        WHERE MaDG = ?
    `;
    
    db.query(sql, [maDG], (err, results) => {
        if (err) {
            console.error('Lỗi query:', err);
            return res.status(500).send('Lỗi truy vấn database');
        }
        if (results.length === 0) {
            return res.status(404).send('Không tìm thấy độc giả');
        }
        res.json(results[0]);
    });
});

// API xử lý thu tiền phạt
app.post('/api/thu-tien-phat', async (req, res) => {
    const { maDG, soTienThu } = req.body;

    if (!maDG || !soTienThu) {
        return res.status(400).send('Thiếu thông tin cần thiết');
    }

    db.beginTransaction(async (err) => {
        if (err) {
            console.error("Lỗi begin transaction:", err);
            return res.status(500).send("Lỗi khi bắt đầu transaction");
        }

        try {
            // Kiểm tra và cập nhật tổng nợ
            const [docGia] = await db.promise().query(
                'SELECT TongNo FROM DocGia WHERE MaDG = ?',
                [maDG]
            );

            if (docGia.length === 0) {
                throw new Error('Không tìm thấy độc giả');
            }

            const tongNoHienTai = docGia[0].TongNo;
            if (soTienThu > tongNoHienTai) {
                throw new Error('Số tiền thu không được lớn hơn tổng nợ');
            }

            const tongNoMoi = tongNoHienTai - soTienThu;

            // Cập nhật tổng nợ mới
            await db.promise().query(
                'UPDATE DocGia SET TongNo = ? WHERE MaDG = ?',
                [tongNoMoi, maDG]
            );

            // Commit transaction
            await new Promise((resolve, reject) => {
                db.commit(err => {
                    if (err) reject(err);
                    resolve();
                });
            });

            res.send(`Đã thu ${soTienThu}đ tiền phạt. Tổng nợ còn lại: ${tongNoMoi}đ`);

        } catch (error) {
            console.error("Lỗi xử lý:", error);
            await new Promise(resolve => db.rollback(resolve));
            res.status(500).send(error.message || "Lỗi khi xử lý yêu cầu");
        }
    });
});

app.listen(port, () => {
  console.log(`Server đang chạy tại http://localhost:${port}`);
});
