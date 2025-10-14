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

// 당연하지만 DB 작업은 시간이 걸리니까 async, await
const connectDB = async () => {
  try {
    await sequelize.authenticate(); // DB 연결
    console.log("Database Connected!");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
};

module.exports = { sequelize, connectDB };
