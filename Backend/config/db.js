const { Sequelize } = require("sequelize");
require("dotenv").config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT,
    logging: false, // 콘솔 쿼리 로그 안 보이게 하려고
  }
);

const connectDB = async () => {
  try {
    await sequelize.authenticate(); // DB 연결
    console.log("DB 연결 성공!");
  } catch (error) {
    console.error("DB 연결 실패:", error);
  }
};

module.exports = { sequelize, connectDB };
