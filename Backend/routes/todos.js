const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const {
  getTodos,
  createTodo,
  updateTodo,
  deleteTodo,
} = require("../controllers/todoController");

router.use(authMiddleware); // 특정 함수 들어가기 전에 authMiddleware 이용해서 JWT 검증 및 사용자 정보 주입

// 내 Todo 전체 조회
router.get("/", getTodos);

// 개인 Todo 추가
router.post("/", createTodo);

// 개인 Todo 수정
router.patch("/:id", updateTodo);

// 개인 Todo 삭제
router.delete("/:id", deleteTodo);

module.exports = router;
