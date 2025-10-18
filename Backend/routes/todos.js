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

router.use(authMiddleware); // 특정 함수 들어가기 전에 authMiddleware 이용해서 JWT 검증 및 사용자 정보 주입

// 내 Todo 전체 조회
router.get("/", getPersonalTodos);

// 개인 Todo 추가
router.post("/", createPersonalTodo);

// 개인 Todo 수정
router.put("/:id", updatePersonalTodo);

// 개인 Todo 삭제
router.delete("/:id", deletePersonalTodo);

// 개인 Todo 완료 여부 토글
router.patch("/:id/toggle", togglePersonalTodo);

module.exports = router;
