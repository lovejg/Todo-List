const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const { connectDB } = require("./config/db");

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// 테스트 API
app.get("/", (req, res) => {
  res.send("Server is running!");
});

// DB 연결
connectDB();

// Server start
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
