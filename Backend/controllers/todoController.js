const { Todo } = require("../models");

// 내 Todo 전체 조회
getPersonalTodos = async (req, res) => {
  try {
    const todos = await Todo.findAll({
      where: { userId: req.user.id },
      order: [["createdAt", "DESC"]],
    });
    res.json(todos);
  } catch (error) {
    res.status(500).json({ error: "서버 오류" });
  }
};

// Todo 추가
createPersonalTodo = async (req, res) => {
  try {
    const { title } = req.body;
    const todo = await Todo.create({
      title,
      userId: req.user.id,
    });
    res.status(201).json(todo);
  } catch (error) {
    res.status(500).json({ error: "서버 오류" });
  }
};

// Todo 수정
updatePersonalTodo = async (req, res) => {
  try {
    const { id } = req.params;
    const { title } = req.body;
    const todo = await Todo.findOne({
      where: { id, userId: req.user.id },
    });
    if (!todo) {
      return res.status(404).json({ error: "Todo를 찾을 수 없습니다!" });
    }
    if (title !== null && title !== undefined) {
      todo.title = title;
    }
    await todo.save();
    res.status(201).json(todo);
  } catch (error) {
    res.status(500).json({ error: "서버 오류" });
  }
};

// Todo 삭제
deletePersonalTodo = async (req, res) => {
  try {
    const { id } = req.params;
    const todo = await Todo.findOne({
      where: { id, userId: req.user.id },
    });
    if (!todo) {
      return res.status(404).json({ error: "Todo를 찾을 수 없습니다!" });
    }
    await todo.destroy();
    res.status(201).json({ message: "삭제 완료" });
  } catch (error) {
    res.status(500).json({ error: "서버 오류" });
  }
};

// Todo 완료 여부 토글
togglePersonalTodo = async (req, res) => {
  try {
    const { id } = req.params;
    const todo = await Todo.findOne({
      where: { id, userId: req.user.id },
    });
    if (!todo) {
      return res.status(404).json({ error: "Todo를 찾을 수 없습니다!" });
    }

    todo.done = !todo.done;
    await todo.save();

    res.status(201).json(todo);
  } catch (error) {
    res.status(500).json({ error: "서버 오류" });
  }
};

module.exports = {
  getPersonalTodos,
  createPersonalTodo,
  updatePersonalTodo,
  deletePersonalTodo,
  togglePersonalTodo,
};
