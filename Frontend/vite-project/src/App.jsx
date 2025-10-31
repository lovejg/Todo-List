import { useState, useEffect, useRef, useMemo } from "react";
import "./css/App.css";
import TeamModal from "./modals/teamModal.jsx";
import EditModal from "./modals/editModal.jsx";
import InviteModal from "./modals/inviteModal.jsx";
import SignupModal from "./modals/signupModal.jsx";
import LoginModal from "./modals/loginModal.jsx";
import ConfirmDeleteModal from "./modals/confirmDeleteModal.jsx";

import {
  fetchPersonalTodos,
  fetchTeamTodos,
  addTodo,
  toggleTodo,
  deleteTodo,
  updateTodo,
} from "./api/todoApi";
import { fetchTeams, createTeam, removeTeam } from "./api/teamApi";

const getAuthToken = () => localStorage.getItem("token");

function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [teamModalOpen, setTeamModalOpen] = useState(false);
  const [teamName, setTeamName] = useState("");
  const [teams, setTeams] = useState([]);
  const [personalTodos, setPersonalTodos] = useState([]);
  const [activePage, setActivePage] = useState("personal");
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editTodoId, setEditTodoId] = useState(null);
  const [newText, setNewText] = useState("");
  const [confirmDeleteModalOpen, setConfirmDeleteModalOpen] = useState(false);
  const [deleteTodoId, setDeleteTodoId] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [inviteModalOpen, setInviteModalOpen] = useState(false);
  const [invites, setInvites] = useState([]);
  const [signupModalOpen, setSignupModalOpen] = useState(false);
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const menuRef = useRef(null);

  const checkTeamId = (value) => {
    if (value === null || value === undefined) return null;
    if (typeof value === "number") return value;
    const parsed = Number(value);
    return Number.isNaN(parsed) ? null : parsed;
  };

  const getActiveTeamId = () =>
    activePage === "personal" ? null : checkTeamId(activePage);

  useEffect(() => {
    const token = getAuthToken();
    if (token) {
      setIsAuthenticated(true);
      fetchPersonalTodos({ setIsLoading, setError, setPersonalTodos });
      fetchTeams({ setIsLoading, setError, setTeams });
    }
  }, []);

  const refreshTodos = async (teamId = getActiveTeamId()) => {
    const resolvedTeamId = checkTeamId(teamId);
    if (resolvedTeamId === null)
      return fetchPersonalTodos({ setIsLoading, setError, setPersonalTodos });
    return fetchTeamTodos(resolvedTeamId, {}, { setIsLoading, setError, setTeams, checkTeamId });
  };

  const handleAddTodo = (e) => {
    e.preventDefault();
    addTodo({
      title: inputValue,
      teamId: getActiveTeamId(),
      setIsLoading,
      setError,
      refreshTodos,
    });
    setInputValue("");
  };

  const handleToggle = (todoId, currentDone) => {
    toggleTodo({
      todoId,
      currentDone,
      teamId: getActiveTeamId(),
      setIsLoading,
      setError,
      refreshTodos,
    });
  };

  const handleDelete = (todoId) => {
    deleteTodo({
      todoId,
      teamId: getActiveTeamId(),
      setIsLoading,
      setError,
      refreshTodos,
    });
  };

  const startEdit = (todoId, title) => {
    setEditTodoId(todoId);
    setNewText(title);
    setEditModalOpen(true);
  };

  const closeEditModal = () => {
    setEditModalOpen(false);
    setNewText("");
    setEditTodoId(null);
  };

  const handleSaveEdit = async (newText) => {
    await updateTodo({
      todoId: editTodoId,
      newText,
      teamId: getActiveTeamId(),
      setIsLoading,
      setError,
      refreshTodos,
    });
    closeEditModal();
  };

  const handleRemoveTeam = () => {
    removeTeam({
      teamId: selectedTeam,
      activePage,
      checkTeamId,
      setActivePage,
      setIsLoading,
      setError,
      setMenuOpen,
      fetchTeams: () => fetchTeams({ setIsLoading, setError, setTeams }),
    });
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
    setPersonalTodos([]);
    setTeams([]);
    setActivePage("personal");
  };

  const startDelete = (todoId) => {
    setDeleteTodoId(todoId);
    setConfirmDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    handleDelete(deleteTodoId);
    setConfirmDeleteModalOpen(false);
    setDeleteTodoId(null);
  };

  const openMenu = (teamId) => {
    setSelectedTeam(teamId);
    setMenuOpen(true);
  };

  useEffect(() => {
    if (menuOpen) {
      const handleClickOutside = (event) => {
        if (menuRef.current && !menuRef.current.contains(event.target)) {
          setMenuOpen(false);
        }
      };
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [menuOpen]);

  const activeTeamId = useMemo(() => checkTeamId(activePage), [activePage]);
  const activeTeam = useMemo(
    () => teams.find((t) => checkTeamId(t.id) === activeTeamId) || null,
    [teams, activeTeamId]
  );
  const activeTodos = activeTeamId === null ? personalTodos : activeTeam?.todos || [];

  return (
    <div className={`app-container ${darkMode ? "dark" : ""}`}>
      <nav>
        <div className="logo">todo-list</div>
        <div className="nav-right">
          <button onClick={() => setDarkMode(!darkMode)} className="nav-btn">
            {darkMode ? "☀️ 라이트모드" : "🌙 야간모드"}
          </button>
          {isAuthenticated ? (
            <button className="nav-btn" onClick={handleLogout}>로그아웃</button>
          ) : (
            <>
              <button onClick={() => setLoginModalOpen(true)} className="nav-btn">로그인</button>
              <button onClick={() => setSignupModalOpen(true)} className="nav-btn">회원가입</button>
            </>
          )}
        </div>
      </nav>

      <aside className="sidebar">
        <button
          className={`todo-btn-individual ${activePage === "personal" ? "active" : ""}`}
          onClick={() => setActivePage("personal")}
        >
          개인 할 일 목록
        </button>
        {teams.map((team) => {
          const teamId = checkTeamId(team.id);
          const isActive = teamId === activeTeamId;
          return (
            <button
              key={team.id}
              className={`todo-btn-team ${isActive ? "active" : ""}`}
              onClick={() => setActivePage(team.id)}
            >
              <span>{team.name} 할 일 목록</span>
              <span
                className="more-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  openMenu(team.id);
                }}
              >
                ···
              </span>
            </button>
          );
        })}
        <button
          className="btn-team-create"
          onClick={() => setTeamModalOpen(true)}
          disabled={!isAuthenticated}
        >
          팀 만들기
        </button>
      </aside>

      <main className="main-content">
        {isLoading ? (
          <div className="loading">로딩 중...</div>
        ) : error ? (
          <div className="error">{error}</div>
        ) : !isAuthenticated ? (
          <div className="login-message">로그인이 필요합니다.</div>
        ) : (
          <div className="todo-section">
            <form onSubmit={handleAddTodo} className="todo-form">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="할 일을 입력하세요"
              />
              <button type="submit">등록하기</button>
            </form>

            <div className="todo-list">
              <h2>{activeTeamId === null ? "TO DO" : `${activeTeam?.name} TO DO`}</h2>
              <ul>
                {activeTodos
                  .filter((todo) => !todo.done)
                  .map((todo) => (
                    <li key={todo.id}>
                      <input
                        type="checkbox"
                        checked={todo.done}
                        onChange={() => handleToggle(todo.id, todo.done)}
                      />
                      <span>{todo.title}</span>
                      <button className="edit-btn" onClick={() => startEdit(todo.id, todo.title)}>수정</button>
                      <button className="delete-btn" onClick={() => startDelete(todo.id)}>삭제</button>
                    </li>
                  ))}
              </ul>
            </div>

            <div className="done-list">
              <h2>{activeTeamId === null ? "DONE" : `${activeTeam?.name} DONE`}</h2>
              <ul>
                {activeTodos
                  .filter((todo) => todo.done)
                  .map((todo) => (
                    <li key={todo.id}>
                      <input type="checkbox" checked readOnly />
                      <span>{todo.title}</span>
                      <button className="delete-btn" onClick={() => startDelete(todo.id)}>삭제</button>
                    </li>
                  ))}
              </ul>
            </div>
          </div>
        )}
      </main>

      <TeamModal
        isOpen={teamModalOpen}
        onClose={() => setTeamModalOpen(false)}
        onCreate={createTeam}
        teamName={teamName}
        setTeamName={setTeamName}
      />

      <EditModal
        isOpen={editModalOpen}
        onClose={closeEditModal}
        onSave={handleSaveEdit}
        newText={newText}
        setNewText={setNewText}
      />

      <ConfirmDeleteModal
        isOpen={confirmDeleteModalOpen}
        onClose={() => setConfirmDeleteModalOpen(false)}
        onConfirm={confirmDelete}
      />

      <InviteModal
        isOpen={inviteModalOpen}
        onClose={() => setInviteModalOpen(false)}
        teamId={selectedTeam}
        invites={invites}
        setInvites={setInvites}
      />

      <SignupModal
        isOpen={signupModalOpen}
        onClose={() => setSignupModalOpen(false)}
      />

      <LoginModal
        isOpen={loginModalOpen}
        darkMode={darkMode}
        onClose={() => setLoginModalOpen(false)}
        onLoginSuccess={() => {
          setIsAuthenticated(true);
          setLoginModalOpen(false);
          fetchPersonalTodos({ setIsLoading, setError, setPersonalTodos });
          fetchTeams({ setIsLoading, setError, setTeams });
        }}
      />

      {menuOpen && (
        <div className="menu-dropdown" ref={menuRef}>
          <button onClick={() => setInviteModalOpen(true)}>팀원 초대하기</button>
          <button onClick={handleRemoveTeam}>팀 삭제</button>
        </div>
      )}
    </div>
  );
}

export default App;