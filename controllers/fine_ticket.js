const fineService = require('../services/fine_ticket');

class FineController {
  async showFineForm(req, res) {
    try {
      const maDG = req.params.id;
      const reader = await fineService.getReaderFine(maDG);

      if (!reader) {
        throw new Error('Không tìm thấy độc giả');
      }

      res.render('librarian/fine_ticket', {
        reader: reader,
        user: req.session.user,
        maDG: maDG
      });
    } catch (error) {
      res.status(500).send(error.message);
    }
  }

  async createFineTicket(req, res) {
    try {
      const { maDG, soTienThu } = req.body;
      const result = await fineService.createFineTicket(
        parseInt(maDG),
        parseInt(soTienThu),
        req.session.user.MaNV
      );

      res.json({
        success: true,
        message: 'Tạo phiếu thu tiền phạt thành công',
        data: result
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }
}

module.exports = new FineController();