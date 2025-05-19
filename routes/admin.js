const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Middleware to check if user is authenticated as admin
const isAdmin = (req, res, next) => {
    if (!req.session.user) {
        return res.redirect('/auth/login');
    }

    if (req.session.user.accountType !== 1) {
        return res.redirect('/auth/login');
    }

    next();
};

// Apply isAdmin middleware to all admin routes
router.use(isAdmin);

// Admin dashboard
router.get('/dashboard', (req, res) => {
    res.render('admin/dashboard', { user: req.session.user });
});

// GET register librarian form
router.get('/register-librarian', (req, res) => {
    res.render('admin/register-librarian', { user: req.session.user });
});

// POST register librarian
router.post('/register-librarian', async (req, res) => {
    const { hoTen, email, matKhau, xacNhanMatKhau } = req.body;

    // Check if passwords match
    if (matKhau !== xacNhanMatKhau) {
        return res.render('admin/register-librarian', {
            error: 'Mật khẩu và xác nhận mật khẩu không khớp',
            user: req.session.user
        });
    }

    try {
        // Check if email already exists
        const [existingUsers] = await db.query('SELECT * FROM NhanVien WHERE Email = ?', [email]);

        if (existingUsers.length > 0) {
            return res.render('admin/register-librarian', {
                error: 'Email này đã được sử dụng',
                user: req.session.user
            });
        }

        // Get default QuyDinh
        const [quyDinh] = await db.query('SELECT * FROM QuyDinh WHERE MaQD = 1');
        const maQD = quyDinh[0].MaQD;

        // Insert new librarian
        const [result] = await db.query(
            'INSERT INTO NhanVien (HoTen, Email, MatKhau, LoaiTaiKhoan, MaQD) VALUES (?, ?, ?, ?, ?)',
            [hoTen, email, matKhau, 0, maQD] // LoaiTaiKhoan = 0 for regular librarian
        );

        if (result.affectedRows === 1) {
            return res.render('admin/register-librarian', {
                success: 'Đăng ký thủ thư mới thành công',
                user: req.session.user
            });
        } else {
            return res.render('admin/register-librarian', {
                error: 'Có lỗi xảy ra, vui lòng thử lại',
                user: req.session.user
            });
        }

    } catch (error) {
        console.error('Error registering librarian:', error);
        return res.render('admin/register-librarian', {
            error: 'Đã xảy ra lỗi, vui lòng thử lại sau',
            user: req.session.user
        });
    }
});

// GET manage librarians
router.get('/manage-librarians', async (req, res) => {
    try {
        // Get all librarians
        const [librarians] = await db.query('SELECT * FROM NhanVien WHERE LoaiTaiKhoan = 0');

        res.render('admin/manage-librarians', {
            user: req.session.user,
            librarians
        });
    } catch (error) {
        console.error('Error fetching librarians:', error);
        res.redirect('/admin/dashboard');
    }
});

// Placeholder routes for other admin functions
router.get('/rules', (req, res) => {
    res.send('Trang cập nhật quy định thư viện');
});

router.get('/reports/revenue', (req, res) => {
    res.send('Trang báo cáo doanh thu');
});

router.get('/reports/books', (req, res) => {
    res.send('Trang báo cáo thống kê sách');
});

module.exports = router; 