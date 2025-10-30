const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const {
  createTeam,
  getMyTeams,
  getTeamDetail,
  deleteTeam,
  inviteMember,
} = require("../controllers/teamController");

router.use(authMiddleware); // 특정 함수 들어가기 전에 authMiddleware 이용해서 JWT 검증 및 사용자 정보 주입

// 팀 생성
router.post("/", createTeam);

// 내가 속한 팀 목록 조회
router.get("/", getMyTeams);

// 팀 상세 조회
router.get("/:teamId", getTeamDetail);

// 팀 삭제
router.delete("/:teamId", deleteTeam);

// 팀 초대
router.post("/:teamId/invitations", inviteMember);

module.exports = router;
