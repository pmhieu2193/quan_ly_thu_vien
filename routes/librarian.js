const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Middleware to check if user is authenticated as librarian
const isLibrarian = (req, res, next) => {
    if (!req.session.user) {
        return res.redirect('/auth/login');
    }

    // Both admin and librarian can access librarian features
    if (req.session.user.accountType !== 0 && req.session.user.accountType !== 1) {
        return res.redirect('/auth/login');
    }

    next();
};

// Apply isLibrarian middleware to all librarian routes
router.use(isLibrarian);

// Librarian dashboard
router.get('/dashboard', (req, res) => {
    res.render('librarian/dashboard', { user: req.session.user });
});

// GET register reader form
router.get('/register-reader', (req, res) => {
    res.render('librarian/register-reader', { user: req.session.user });
});

// POST register reader (create library card)
router.post('/register-reader', async (req, res) => {
    const { hoTen, ngaySinh, diaChi, email, loai } = req.body;

    try {
        // Check if email already exists
        const [existingUsers] = await db.query('SELECT * FROM DocGia WHERE Email = ?', [email]);

        if (existingUsers.length > 0) {
            return res.render('librarian/register-reader', {
                error: 'Email này đã được sử dụng',
                user: req.session.user
            });
        }

        // Get default QuyDinh for thoiHanThe (card validity period)
        const [quyDinh] = await db.query('SELECT * FROM QuyDinh WHERE MaQD = 1');
        const thoiHanThe = quyDinh[0].ThoiHanThe; // 6 months by default

        // Calculate expiration date (NgayHetHan)
        const ngayLapThe = new Date();
        const ngayHetHan = new Date();
        ngayHetHan.setMonth(ngayHetHan.getMonth() + thoiHanThe);

        // Insert new reader
        const [result] = await db.query(
            `INSERT INTO DocGia 
            (HoTen, NgaySinh, DiaChi, Email, Loai, TrangThaiThe, TongNo, NgayLapThe, NgayHetHan, TinhTrangMuon) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [hoTen, ngaySinh, diaChi, email, loai, 1, 0, ngayLapThe, ngayHetHan.toISOString().split('T')[0], 0]
        );

        if (result.affectedRows === 1) {
            return res.render('librarian/register-reader', {
                success: 'Đăng ký thẻ thư viện thành công',
                user: req.session.user
            });
        } else {
            return res.render('librarian/register-reader', {
                error: 'Có lỗi xảy ra, vui lòng thử lại',
                user: req.session.user
            });
        }

    } catch (error) {
        console.error('Error registering reader:', error);
        return res.render('librarian/register-reader', {
            error: 'Đã xảy ra lỗi, vui lòng thử lại sau',
            user: req.session.user
        });
    }
});

// GET manage readers
router.get('/manage-readers', async (req, res) => {
    try {
        // Get all readers
        const [readers] = await db.query('SELECT * FROM DocGia');

        res.send(`<h1>Danh sách độc giả (${readers.length})</h1><p>Trang này sẽ hiển thị danh sách độc giả</p>`);
    } catch (error) {
        console.error('Error fetching readers:', error);
        res.redirect('/librarian/dashboard');
    }
});

// Placeholder routes for other librarian functions
router.get('/borrow', (req, res) => {
    res.send('Trang lập phiếu mượn sách');
});

router.get('/return', (req, res) => {
    res.send('Trang lập phiếu trả sách');
});

router.get('/fine', (req, res) => {
    res.send('Trang lập phiếu thu tiền phạt');
});

router.get('/books', (req, res) => {
    res.send('Trang danh mục sách');
});

router.get('/books/add', (req, res) => {
    res.send('Trang thêm sách mới');
});

module.exports = router; 