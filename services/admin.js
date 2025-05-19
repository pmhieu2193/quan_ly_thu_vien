const AdminRepository = require('../repository/admin');

class AdminService {
  constructor() {
    this.adminRepository = new AdminRepository();
  }

  async getDashboardData(userId) {
    try {
      const librarians = await this.adminRepository.getLibrarians();
      return {
        totalLibrarians: librarians.length,
        recentLibrarians: librarians.slice(0, 5)
      };
    } catch (error) {
      console.error('Error in getDashboardData:', error);
      throw error;
    }
  }

  async getAdminCount() {
    try {
      return await this.adminRepository.getAdminCount();
    } catch (error) {
      console.error('Error in getAdminCount:', error);
      throw error;
    }
  }
  
  async registerLibrarian(librarianData) {
    try {
      const existingUser = await this.adminRepository.findByEmail(librarianData.Email);
      if (existingUser) {
        throw new Error('Email đã được sử dụng');
      }

      if (librarianData.LoaiTaiKhoan === 1) {
        const adminCount = await this.getAdminCount();
        if (adminCount > 0) {
          throw new Error('Chỉ được phép có một tài khoản Admin');
        }
      }

      return await this.adminRepository.createLibrarian(librarianData);
    } catch (error) {
      console.error('Error in registerLibrarian:', error);
      throw error;
    }
  }
}

module.exports = new AdminService();