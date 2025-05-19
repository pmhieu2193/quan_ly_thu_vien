const express = require('express');
const router = express.Router();
const db = require('../config/db');
const bcrypt = require('bcryptjs');

// GET login page
router.get('/login', (req, res) => {
    res.render('login', { title: 'Đăng nhập' });
});

// Handle login POST
router.post('/login', async (req, res) => {
    const { email, password, accountType } = req.body;

    try {
        // Find user by email
        const [users] = await db.query(
            'SELECT * FROM NhanVien WHERE Email = ?',
            [email]
        );

        const user = users[0];

        // Check if user exists
        if (!user) {
            return res.render('login', { error: 'Email hoặc mật khẩu không đúng' });
        }

        // Check if user type matches the requested account type
        if (parseInt(user.LoaiTaiKhoan) !== parseInt(accountType)) {
            // Handle mismatched account type
            if (parseInt(accountType) === 1) {
                return res.render('login', { error: 'Bạn không có quyền truy cập trang quản lý' });
            } else {
                return res.render('login', { error: 'Vui lòng đăng nhập đúng loại tài khoản' });
            }
        }

        // For simplicity, direct password comparison (in real app, use bcrypt.compare)
        // Note: In production, we should store hashed passwords in the database
        if (user.MatKhau !== password) {
            return res.render('login', { error: 'Email hoặc mật khẩu không đúng' });
        }

        // Set session data
        req.session.user = {
            id: user.MaNV,
            name: user.HoTen,
            email: user.Email,
            accountType: user.LoaiTaiKhoan
        };

        // Redirect based on account type
        if (parseInt(user.LoaiTaiKhoan) === 1) {
            return res.redirect('/admin/dashboard');
        } else {
            return res.redirect('/librarian/dashboard');
        }

    } catch (error) {
        console.error('Login error:', error);
        return res.render('login', { error: 'Đã xảy ra lỗi, vui lòng thử lại sau' });
    }
});

// Handle logout
router.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/auth/login');
});

module.exports = router; 