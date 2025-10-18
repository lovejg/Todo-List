const { Todo } = require("../models");

// 내 Todo 전체 조회
const getPersonalTodos = async (req, res) => {
  try {
    const todos = await Todo.findAll({
      where: { user_id: req.user.id },
      order: [["createdAt", "DESC"]],
    });
    res.status(200).json(todos);
  } catch (error) {
    res.status(500).json({ error: "서버 오류" });
  }
};

// 개인 Todo 추가
const createPersonalTodo = async (req, res) => {
  try {
    const { title } = req.body;
    const todo = await Todo.create({
      title,
      user_id: req.user.id,
    });
    res.status(201).json(todo);
  } catch (error) {
    res.status(500).json({ error: "서버 오류" });
  }
};

// 개인 Todo 수정
const updatePersonalTodo = async (req, res) => {
  try {
    const { id } = req.params;
    const { title } = req.body;
    const todo = await Todo.findOne({
      where: { id, user_id: req.user.id },
    });
    if (!todo) {
      return res.status(404).json({ error: "Todo를 찾을 수 없습니다!" });
    }
    if (title !== null && title !== undefined) {
      todo.title = title;
    }
    await todo.save();
    res.status(200).json(todo);
  } catch (error) {
    res.status(500).json({ error: "서버 오류" });
  }
};

// 개인 Todo 삭제
const deletePersonalTodo = async (req, res) => {
  try {
    const { id } = req.params;
    const todo = await Todo.findOne({
      where: { id, user_id: req.user.id },
    });
    if (!todo) {
      return res.status(404).json({ error: "Todo를 찾을 수 없습니다!" });
    }
    await todo.destroy();
    res.sendStatus(204); // 204 오류는 content가 있으면 안된다 해서 이렇게 함
  } catch (error) {
    res.status(500).json({ error: "서버 오류" });
  }
};

// 개인 Todo 완료 여부 토글
const togglePersonalTodo = async (req, res) => {
  try {
    const { id } = req.params;
    const todo = await Todo.findOne({
      where: { id, user_id: req.user.id },
    });
    if (!todo) {
      return res.status(404).json({ error: "Todo를 찾을 수 없습니다!" });
    }

    todo.done = !todo.done;
    await todo.save();

    res.status(200).json(todo);
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
