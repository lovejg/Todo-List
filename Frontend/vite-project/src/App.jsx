import { useState, useEffect, useRef } from "react";
import "./App.css";
import TeamModal from "./teamModal.jsx";
import EditModal from "./editModal.jsx";
import InviteModal from "./inviteModal.jsx";
import SignupModal from "./signupModal.jsx";
import LoginModal from "./loginModal.jsx";
import ConfirmDeleteModal from "./confirmDeleteModal.jsx";

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

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsAuthenticated(true);
      fetchPersonalTodos();
      fetchTeams();
    }
  }, []);

  const checkTeamId = (value) => {
    if (value === null || value === undefined) {
      return null;
    }
    if (typeof value === "number") {
      return value;
    }

    const parsed = Number(value);
    return Number.isNaN(parsed) ? null : parsed;
  };

  const fetchPersonalTodos = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:4000/api/todo/personal", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json().catch(() => null);

      if (res.ok) {
        const todos = Array.isArray(data) ? data : data?.todos || [];
        setPersonalTodos(todos);
        setError(null);
      } else {
        setError(data?.error || "할 일 목록을 가져오는데 실패했습니다.");
      }
    } catch (err) {
      setError("서버 연결에 실패했습니다.");
      console.error("Error fetching personal todos:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchTeams = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:4000/api/team", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json().catch(() => null);

      if (res.ok) {
        const teamsData = Array.isArray(data) ? data : data?.teams || [];
        setTeams((prevTeams) =>
          teamsData.map((team) => {
            const existing = prevTeams.find((prev) => prev.id === team.id);
            return {
              ...team,
              todos: existing?.todos || [],
            };
          })
        );
        setError(null);
      } else {
        setError(data?.error || "팀 목록을 가져오는데 실패했습니다.");
      }
    } catch (err) {
      setError("서버 연결에 실패했습니다.");
      console.error("Error fetching team:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchTeamTodos = async (
    teamId,
    { skipLoading = false, silent = false } = {}
  ) => {
    const resolvedTeamId = checkTeamId(teamId);
    if (resolvedTeamId === null) {
      const message = "선택된 팀을 찾을 수 없습니다.";
      if (!silent) {
        setError(message);
      }
      return { success: false, error: message, clientError: true };
    }
    try {
      if (!skipLoading) {
        setIsLoading(true);
      }
      const token = localStorage.getItem("token");
      const res = await fetch(
        `http://localhost:4000/api/team/${resolvedTeamId}/todo`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await res.json().catch(() => null);

      if (res.ok) {
        const todos = Array.isArray(data) ? data : data?.todos || [];
        setTeams((prevTeams) =>
          prevTeams.map((team) =>
            team.id === resolvedTeamId ? { ...team, todos } : team
          )
        );
        setError(null);
      } else {
        setError(data?.error || "팀 할 일 목록을 가져오는데 실패했습니다.");
      }
    } catch (err) {
      setError("서버 연결에 실패했습니다.");
      console.error("Error fetching team todos:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const addTodo = async (e) => {
    e.preventDefault();
    if (!inputValue.trim() || !isAuthenticated) return;

    const teamId =
      activePage === "personal"
        ? checkTeamId(selectedTeam)
        : checkTeamId(activePage);

    if (activePage !== "personal" && teamId === null) {
      setError("선택된 팀을 찾을 수 없습니다.");
      return;
    }

    try {
      setIsLoading(true);
      const token = localStorage.getItem("token");
      const endpoint =
        activePage === "personal"
          ? "http://localhost:4000/api/todo/personal"
          : `http://localhost:4000/api/team/${teamId}/todo`;

      const res = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title: inputValue }),
      });
      const data = await res.json().catch(() => null);

      if (res.ok) {
        if (activePage === "personal") {
          await fetchPersonalTodos();
        } else if (teamId !== null) {
          const createdTodo = data?.todo;
          if (createdTodo) {
            setTeams((prevTeams) =>
              prevTeams.map((team) =>
                team.id === teamId
                  ? { ...team, todos: [createdTodo, ...(team.todos || [])] }
                  : team
              )
            );
          } else {
            await fetchTeamTodos(teamId, { skipLoading: true });
          }
        }
        setError(null);
        setInputValue("");
      } else {
        const message = data?.error || "할 일 추가에 실패했습니다.";
        if (res.status >= 400 && res.status < 500) {
          setError(null);
          alert(message);
        } else {
          setError(message);
        }
      }
    } catch (err) {
      setError("서버 연결에 실패했습니다.");
      console.error("Error adding todo:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggle = async (todoId) => {
    const teamId =
      activePage === "personal"
        ? checkTeamId(selectedTeam)
        : checkTeamId(activePage);

    if (activePage !== "personal" && teamId === null) {
      setError("선택된 팀을 찾을 수 없습니다.");
      return;
    }
    try {
      setIsLoading(true);
      const token = localStorage.getItem("token");
      const endpoint =
        activePage === "personal"
          ? `http://localhost:4000/api/todo/personal/${todoId}/toggle`
          : `http://localhost:4000/api/team/${teamId}/todo/${todoId}/toggle`;

      const res = await fetch(endpoint, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        if (activePage === "personal") {
          fetchPersonalTodos();
        } else if (teamId !== null) {
          fetchTeamTodos(teamId);
        }
        setError(null);
      } else {
        const data = await res.json().catch(() => null);
        const message = data?.error || "할 일 상태 변경에 실패했습니다.";
        if (res.status >= 400 && res.status < 500) {
          setError(null);
          alert(message);
        } else {
          setError(message);
        }
      }
    } catch (err) {
      setError("서버 연결에 실패했습니다.");
      console.error("Error toggling todo:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteTodo = async (todoId) => {
    const teamId =
      activePage === "personal"
        ? checkTeamId(selectedTeam)
        : checkTeamId(activePage);

    if (activePage !== "personal" && teamId === null) {
      setError("선택된 팀을 찾을 수 없습니다.");
      return;
    }
    try {
      setIsLoading(true);
      const token = localStorage.getItem("token");
      const endpoint =
        activePage === "personal"
          ? `http://localhost:4000/api/todo/personal/${todoId}`
          : `http://localhost:4000/api/team/${teamId}/todo/${todoId}`;

      const res = await fetch(endpoint, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        if (activePage === "personal") {
          fetchPersonalTodos();
        } else if (teamId !== null) {
          fetchTeamTodos(teamId);
        }
        setError(null);
      } else {
        const data = await res.json().catch(() => null);
        const message = data?.error || "할 일 삭제에 실패했습니다.";
        if (res.status >= 400 && res.status < 500) {
          setError(null);
          alert(message);
        } else {
          setError(message);
        }
      }
    } catch (err) {
      setError("서버 연결에 실패했습니다.");
      console.error("Error deleting todo:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const startEdit = (todoId, title) => {
    setEditTodoId(todoId);
    setNewText(title);
    setEditModalOpen(true);
  };

  const saveEdit = async (newText) => {
    const teamId =
      activePage === "personal"
        ? checkTeamId(selectedTeam)
        : checkTeamId(activePage);

    if (activePage !== "personal" && teamId === null) {
      setError("선택된 팀을 찾을 수 없습니다.");
      return { success: false, error: "선택된 팀을 찾을 수 없습니다." };
    }
    try {
      setIsLoading(true);
      const token = localStorage.getItem("token");
      const endpoint =
        activePage === "personal"
          ? `http://localhost:4000/api/todo/personal/${editTodoId}`
          : `http://localhost:4000/api/team/${teamId}/todo/${editTodoId}`;

      const res = await fetch(endpoint, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title: newText }),
      });

      if (res.ok) {
        if (activePage === "personal") {
          fetchPersonalTodos();
        } else if (teamId !== null) {
          fetchTeamTodos(teamId);
        }
        setEditModalOpen(false);
        setNewText("");
        setEditTodoId(null);
        setError(null);
      } else {
        const data = await res.json().catch(() => null);
        const message = data?.error || "할 일 수정에 실패했습니다.";
        if (res.status >= 400 && res.status < 500) {
          setError(null);
          alert(message);
        } else {
          setError(message);
        }
        return { success: false, error: message };
      }
    } catch (err) {
      setError("서버 연결에 실패했습니다.");
      return { success: false, error: "서버 연결에 실패했습니다." };
    } finally {
      setIsLoading(false);
    }
  };

  const createTeam = async (name) => {
    const trimmedName = name.trim();
    if (!trimmedName) {
      return { success: false, error: "팀 이름을 입력해주세요." };
    }
    try {
      setIsLoading(true);
      const token = localStorage.getItem("token");
      if (!token) {
        const message = "로그인이 필요합니다.";
        setError(message);
        return { success: false, error: message };
      }
      const res = await fetch("http://localhost:4000/api/team", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name: trimmedName }),
      });

      if (res.ok) {
        fetchTeams();
        setError(null);
        return { success: true };
      }

      const data = await res.json().catch(() => null);
      const message = data?.error || "팀 생성에 실패했습니다.";
      if (res.status >= 400 && res.status < 500) {
        return { success: false, error: message, clientError: true };
      }
      setError(message);
      return { success: false, error: message };
    } catch (err) {
      const message = "서버 연결에 실패했습니다.";
      setError(message);
      return { success: false, error: message };
    } finally {
      setIsLoading(false);
    }
  };

  const removeTeam = async (teamId) => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:4000/api/team/${teamId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        if (activePage === teamId) {
          setActivePage("personal");
        }
        fetchTeams();
        setMenuOpen(false);
      } else {
        const data = await res.json().catch(() => null);
        const message = data?.error || "팀 삭제에 실패했습니다.";
        if (res.status >= 400 && res.status < 500) {
          setError(null);
          alert(message);
        } else {
          setError(message);
        }
      }
    } catch (err) {
      setError("서버 연결에 실패했습니다.");
      console.error("Error removing team:", err);
      setError("할 일 수정에 실패했습니다.");
    } finally {
      setIsLoading(false);
    }
  };


  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
    setPersonalTodos([]);
    setTeams([]);
    setSelectedTeam(null);
    setMenuOpen(false);
    setActivePage("personal");
    setError(null);
  };

  const startDelete = (todoId) => {
    setDeleteTodoId(todoId);
    setConfirmDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    deleteTodo(deleteTodoId);
    setConfirmDeleteModalOpen(false);
    setDeleteTodoId(null);
  };

  const openMenu = (teamId) => {
    setSelectedTeam(teamId);
    setMenuOpen(true);
  };


  useEffect(() => {
    if (activePage !== "personal" && isAuthenticated) {
      fetchTeamTodos(activePage);
    }
  }, [activePage]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };

    if (menuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuOpen]);


  return (
    <div className={`app-container ${darkMode ? "dark" : ""}`}>
      <nav>
        <div className="logo">todo-list</div>
        <div className="nav-right">
          <button className="nav-btn" onClick={() => setDarkMode(!darkMode)}>
            {darkMode ? "☀️ 라이트모드" : "🌙 야간모드"}
          </button>
          {isAuthenticated ? (
            <button className="nav-btn" onClick={handleLogout}>
              로그아웃
            </button>
          ) : (
            <>
              <button
                className="nav-btn"
                onClick={() => setLoginModalOpen(true)}
              >
                로그인
              </button>
              <button
                className="nav-btn"
                onClick={() => setSignupModalOpen(true)}
              >
                회원가입
              </button>
            </>
          )}
        </div>
      </nav>

      <aside className="sidebar">
        <div className="sidebar-item">
          <button
            className={`todo-btn-individual ${
              activePage === "personal" ? "active" : ""
            }`}
            onClick={() => setActivePage("personal")}
          >
            개인 할 일 목록
          </button>
          {teams.map((team) => (
            <button
              key={team.id}
              className={`todo-btn-team ${
                activePage === team.id ? "active" : ""
              }`}
              onClick={() => setActivePage(team.id)}
            >
              <span>{team.name + " 할 일 목록"}</span>
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
          ))}
          <button
            className="btn-team-create"
            onClick={() => setTeamModalOpen(true)}
            disabled={!isAuthenticated}
          >
            팀 만들기
          </button>
        </div>
      </aside>

      <main className="main-content">
        {isLoading ? (
          <div className="loading">로딩 중...</div>
        ) : error ? (
          <div className="error">{error}</div>
        ) : !isAuthenticated ? (
          <div className="login-message">
            <p>로그인이 필요합니다.</p>
          </div>
        ) : (
          <div className="todo-section">
            <form onSubmit={addTodo} className="todo-form">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="할 일을 입력하세요"
              />
              <button type="submit">등록하기</button>
            </form>

            <div className="todo-list">
              <h2>
                {activePage === "personal"
                  ? "TO DO"
                  : `${teams.find((t) => t.id === activePage)?.name} TO DO`}
              </h2>
              <ul>
                {(activePage === "personal"
                  ? personalTodos
                  : teams.find((t) => t.id === activePage)?.todos || []
                )
                  .filter((todo) => !todo.done)
                  .map((todo) => (
                    <li key={todo.id}>
                      <input
                        type="checkbox"
                        checked={todo.done}
                        onChange={() => handleToggle(todo.id)}
                      />
                      <span>{todo.title}</span>
                      <button
                        className="edit-btn"
                        onClick={() => startEdit(todo.id, todo.title)}
                      >
                        수정
                      </button>
                      <button
                        className="delete-btn"
                        onClick={() => startDelete(todo.id)}
                      >
                        삭제
                      </button>
                    </li>
                  ))}
              </ul>
            </div>

            <div className="done-list">
              <h2>
                {activePage === "personal"
                  ? "DONE"
                  : `${teams.find((t) => t.id === activePage)?.name} DONE`}
              </h2>
              <ul>
                {(activePage === "personal"
                  ? personalTodos
                  : teams.find((t) => t.id === activePage)?.todos || []
                )
                  .filter((todo) => todo.done)
                  .map((todo) => (
                    <li key={todo.id}>
                      <input type="checkbox" checked={true} disabled />
                      <span>{todo.title}</span>
                      <button
                        className="delete-btn"
                        onClick={() => startDelete(todo.id)}
                      >
                        삭제
                      </button>
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
        onClose={() => setEditModalOpen(false)}
        onSave={saveEdit}
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
          fetchPersonalTodos();
          fetchTeams();
        }}
      />

      {menuOpen && (
        <div className="menu-dropdown" ref={menuRef}>
          <button onClick={() => setInviteModalOpen(true)}>
            팀원 초대하기
          </button>
          <button onClick={() => removeTeam(selectedTeam)}>팀 삭제</button>
        </div>
      )}
    </div>
  );
}

export default App;
