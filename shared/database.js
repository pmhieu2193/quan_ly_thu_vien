require('dotenv').config();
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT,
    logging: false
  }
);

(async () => {
  try {
    await sequelize.authenticate();
    console.log(' Kết nối CSDL thành công.');
  } catch (err) {
    console.error('Lỗi kết nối:', err);
  }
})();

module.exports = sequelize;
