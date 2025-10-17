const express = require("express");
const router = express.Router();
const { authMiddleware } = require("../middleware/authMiddleware");
const {
  getPersonalTodos,
  createPersonalTodo,
  updatePersonalTodo,
  deletePersonalTodo,
  togglePersonalTodo,
} = require("../controllers/todoController");

// 특정 함수 들어가기 전에 authMiddleware 이용해서 JWT 검증 및 사용자 정보 주입

// 내 Todo 전체 조회
router.get("/personal", authMiddleware, getPersonalTodos);

// Todo 추가
router.post("/personal", authMiddleware, createPersonalTodo);

// Todo 수정
router.put("/personal/:id", authMiddleware, updatePersonalTodo);

// Todo 삭제
router.patch("/personal/:id/toggle", authMiddleware, togglePersonalTodo);

// Todo 완료 여부 토글
router.delete("/personal/:id", authMiddleware, deletePersonalTodo);

module.exports = router;
