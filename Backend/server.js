const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const { connectDB } = require("./config/db");

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// DB 연결
connectDB();

// 테스트 API
app.get("/", (req, res) => {
  res.send("Server is running!");
});

app.use("/api/auth", require("./routes/auth"));
app.use("/api/todos", require("./routes/todos"));
app.use("/api/teams", require("./routes/teams"));

// Server start
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
