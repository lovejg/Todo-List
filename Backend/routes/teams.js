const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const {
  createTeam,
  getMyTeams,
  getTeamDetail,
  deleteTeam,
  inviteMember,

  getTeamTodos,
  createTeamTodo,
  updateTeamTodo,
  deleteTeamTodo,
  toggleTeamTodo,
} = require("../controllers/teamController");

router.use(authMiddleware); // 특정 함수 들어가기 전에 authMiddleware 이용해서 JWT 검증 및 사용자 정보 주입

// 팀 생성
router.post("/", createTeam);

// 내가 속한 팀 목록 조회
router.get("/", getMyTeams);

// 팀 상세 조회
router.get("/:id", getTeamDetail);

// 팀 삭제
router.delete("/:id", deleteTeam);

// 팀 초대
router.post("/:id/invite", inviteMember);

// 팀 Todo 전체 조회
router.get("/:id/todo", getTeamTodos);

// 팀 Todo 추가
router.post("/:id/todo", createTeamTodo);

// 팀 Todo 수정
router.put("/:id/todo/:todoId", updateTeamTodo);

// 팀 Todo 삭제
router.patch("/:id/todo/:todoId", deleteTeamTodo);

// 팀 Todo 완료 여부 토글
router.delete("/:id/todo/:todoId/toggle", toggleTeamTodo);

module.exports = router;
