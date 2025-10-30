const { Todo, TeamUser } = require("../models");

// 유효성 검사
const checkTeamId = (id) => {
  if (id === null || id === undefined || id === "") {
    return null;
  }
  const parsed = Number(id);
  if (!Number.isInteger(parsed) || parsed <= 0) {
    return undefined;
  }
  return parsed;
};

// 해당 팀 소속인지 확인
const checkTeamMembership = async (teamId, userId) => {
  if (!teamId) {
    return false;
  }

  const membership = await TeamUser.findOne({
    where: { team_id: teamId, user_id: userId },
  });
  return Boolean(membership);
};

// Todo 전체 조회
const getTodos = async (req, res) => {
  const { teamId: rawTeamId } = req.query;
  try {
    const checkedTeamId = checkTeamId(rawTeamId);
    if (checkedTeamId === undefined) {
      return res.status(400).json({ error: "유효한 팀 ID를 입력해주세요." });
    }

    // 팀 Todo 전체 조회(팀 ID가 있을 경우)
    if (checkedTeamId) {
      const isMember = await checkTeamMembership(checkedTeamId, req.user.id);
      if (!isMember) {
        return res.status(403).json({ error: "팀에 속해 있지 않습니다." });
      }
      const todos = await Todo.findAll({
        where: { team_id: checkedTeamId },
        order: [["createdAt", "DESC"]],
      });

      return res.status(200).json(todos);
    }

    // 개인 Todo 전체 조회(팀 ID가 없을 경우)
    const todos = await Todo.findAll({
      where: { user_id: req.user.id },
      order: [["createdAt", "DESC"]],
    });

    return res.status(200).json(todos);
  } catch (error) {
    return res.status(500).json({ error: "서버 오류" });
  }
};

// Todo 추가
const createTodo = async (req, res) => {
  try {
    const { title, teamId: rawTeamId } = req.body;

    if (!title) {
      return res.status(400).json({ error: "할 일 제목을 입력해주세요." });
    }

    const checkedTeamId = checkTeamId(rawTeamId);
    if (checkedTeamId === undefined) {
      return res.status(400).json({ error: "유효한 팀 ID를 입력해주세요." });
    }

    if (checkedTeamId) {
      const isMember = await checkTeamMembership(checkedTeamId, req.user.id);
      if (!isMember) {
        return res.status(403).json({ error: "팀에 속해 있지 않습니다." });
      }
      const todo = await Todo.create({
        title: title,
        team_id: checkedTeamId,
      });

      return res.status(201).json(todo);
    }

    const todo = await Todo.create({
      title: title,
      user_id: req.user.id,
    });
    res.status(201).json(todo);
  } catch (error) {
    return res.status(500).json({ error: "서버 오류" });
  }
};

// Todo 수정
const updateTodo = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, done } = req.body;

    if (title === undefined && done === undefined) {
      return res.status(400).json({ error: "수정할 값을 입력해주세요." });
    }
    const todo = await Todo.findByPk(id);
    if (!todo) {
      return res.status(404).json({ error: "Todo를 찾을 수 없습니다!" });
    }

    if (todo.user_id) {
      if (todo.user_id !== req.user.id) {
        return res.status(403).json({ error: "권한이 없습니다." });
      }
    } else if (todo.team_id) {
      const isMember = await checkTeamMembership(todo.team_id, req.user.id);
      if (!isMember) {
        return res.status(403).json({ error: "해당 팀에 속해 있지 않습니다." });
      }
    } else {
      return res.status(404).json({ error: "Todo를 찾을 수 없습니다." });
    }

    if (title !== undefined) {
      todo.title = title;
    }

    if (done !== undefined) {
      if (typeof done !== "boolean") {
        return res
          .status(400)
          .json({ error: "done 값은 boolean이어야 합니다." });
      }
      todo.done = done;
    }
    return res.status(200).json(todo);
  } catch (error) {
    return res.status(500).json({ error: "서버 오류" });
  }
};

// Todo 삭제
const deleteTodo = async (req, res) => {
  try {
    const { id } = req.params;
    const todo = await Todo.findByPk(id);
    if (!todo) {
      return res.status(404).json({ error: "Todo를 찾을 수 없습니다!" });
    }
    if (todo.user_id) {
      if (todo.user_id !== req.user.id) {
        return res.status(403).json({ error: "권한이 없습니다." });
      }
    } else if (todo.team_id) {
      const isMember = await checkTeamMembership(todo.team_id, req.user.id);
      if (!isMember) {
        return res.status(403).json({ error: "해당 팀에 속해 있지 않습니다." });
      }
    } else {
      return res.status(404).json({ error: "Todo를 찾을 수 없습니다!" });
    }
    await todo.destroy();
    return res.sendStatus(204);
  } catch (error) {
    return res.status(500).json({ error: "서버 오류" });
  }
};

module.exports = {
  getTodos,
  createTodo,
  updateTodo,
  deleteTodo,
};
