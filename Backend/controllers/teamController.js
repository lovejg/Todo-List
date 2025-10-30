const { Team, TeamUser, User } = require("../models");

// 팀 생성
const createTeam = async (req, res) => {
  try {
    const { name } = req.body;
    // const { name, description } = req.body; // 근데 이거 owner_id도 추가할 생각 해야됨
    const userId = req.user.id; // 이거는 authMiddleware에서 얻는거임(로그인한 사용자 id)

    if (!name) {
      return res.status(400).json({ error: "팀 이름을 입력해주세요." });
    }

    const team = await Team.create({
      name,
      // description,
      owner_id: req.user.id,
    });
    await TeamUser.create({ team_id: team.id, user_id: userId });
    res.status(201).json({ message: "팀이 생성되었습니다.", team });
  } catch (error) {
    res.status(500).json({ error: "팀 생성 중 오류가 발생했습니다." });
  }
};

// 내가 속한 팀 목록 조회
const getMyTeams = async (req, res) => {
  try {
    const userId = req.user.id;

    const memberships = await TeamUser.findAll({
      where: { user_id: userId },
      attributes: ["team_id"],
    });
    if (!memberships.length) {
      return res.status(200).json([]);
    }
    const teamIds = [
      ...new Set(memberships.map((membership) => membership.team_id)),
    ];

    const teams = await Team.findAll({
      where: { id: teamIds },
      order: [["createdAt", "DESC"]],
    });

    res.status(200).json(teams);
  } catch (error) {
    res.status(500).json({ error: "팀 목록 조회 중 오류가 발생했습니다." });
  }
};

// 팀 상세 조회
const getTeamDetail = async (req, res) => {
  try {
    const teamId = req.params.teamId;
    const team = await Team.findByPk(teamId, {
      include: [
        {
          model: User,
          through: { attributes: [] }, // join table인 team_user 테이블을 제외
          attributes: ["id", "email"],
        },
      ],
    });

    if (!team) {
      return res.status(404).json({ error: "팀을 찾을 수 없습니다." });
    }
    res.status(200).json(team);
  } catch (error) {
    res.status(500).json({ error: "팀 상세 조회 중 오류가 발생했습니다." });
  }
};

// 팀 삭제
const deleteTeam = async (req, res) => {
  try {
    const teamId = req.params.teamId;
    const userId = req.user.id;

    const member = await TeamUser.findOne({
      where: { team_id: teamId, user_id: userId },
    });

    // 해당 팀 멤버 소속인지 확인
    if (!member) {
      return res.status(403).json({ error: "해당 팀에 속해 있지 않습니다" });
    }

    await Team.destroy({ where: { id: teamId } });
    res.status(200).json({ message: "팀이 삭제됐습니다." });
  } catch (error) {
    res.status(500).json({ error: "팀 삭제 중 오류가 발생했습니다." });
  }
};

// 팀 초대
const inviteMember = async (req, res) => {
  try {
    const teamId = req.params.teamId;
    const { email } = req.body;

    const existUser = await User.findOne({
      where: { email },
    });

    // 존재하는 유저인지 확인
    if (!existUser) {
      return res
        .status(404)
        .json({ error: "해당 이메일의 사용자를 찾을 수 없습니다." });
    }

    const alreadyTeam = await TeamUser.findOne({
      where: { team_id: teamId, user_id: existUser.id },
    });

    // 이미 해당 팀 소속인지 확인
    if (alreadyTeam) {
      return res
        .status(400)
        .json({ error: "이미 팀에 속해 있는 사용자입니다." });
    }

    await TeamUser.create({ team_id: teamId, user_id: existUser.id });
    res.status(201).json({ message: `${email}님이 팀에 초대되었습니다.` });
  } catch (error) {
    res.status(500).json({ error: "팀 초대 중 오류가 발생했습니다." });
  }
};

module.exports = {
  createTeam,
  getMyTeams,
  getTeamDetail,
  deleteTeam,
  inviteMember,
};
