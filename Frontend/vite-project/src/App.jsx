import { useState } from 'react';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import './App.css';
import TeamModal from './teamModal.jsx';
import EditModal from './editModal.jsx';
import InviteModal from './inviteModal.jsx';
import { useEffect, useRef } from 'react';
import SignupModal from './signupModal.jsx';


function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [teamModalOpen, setTeamModalOpen] = useState(false);
  const [teamName, setTeamName] = useState('');
  const [teams, setTeams] = useState([]); // 팀 목록, 각 팀에 todos 포함
  const [personalTodos, setPersonalTodos] = useState([]); // 개인 할 일
  const [activePage, setActivePage] = useState('personal'); // 현재 페이지
  const [editModalOpen, setEditModalOpen] = useState(false); // 수정 모달 상태
  const [editIndex, setEditIndex] = useState(null); // 수정할 할 일 인덱스
  const [newText, setNewText] = useState(''); // 수정할 새 텍스트
  const [menuOpen, setMenuOpen] = useState(false); // 메뉴 열림 상태
  const [selectedTeam, setSelectedTeam] = useState(null); // 선택된 팀 이름
  const [inviteModalOpen, setInviteModalOpen] = useState(false);
  const [invites, setInvites] = useState([]);
  const [signupModalOpen, setSignupModalOpen] = useState(false);
  const menuRef = useRef(null);

  // 할 일 추가 (현재 페이지에 따라)
  const addTodo = (e) => {
    e.preventDefault();
    if (inputValue.trim()) {
      const newTodo = { text: inputValue, completed: false };
      if (activePage === 'personal') {
        setPersonalTodos([...personalTodos, newTodo]);
      } else {
        setTeams(teams.map(team =>
          team.name === activePage ? { ...team, todos: [...team.todos, newTodo] } : team
        ));
      }
      setInputValue('');
    }
  };

  // 체크박스 토글 (현재 페이지에 따라)
  const handleToggle = (index) => {
    if (activePage === 'personal') {
      const newTodos = [...personalTodos];
      newTodos[index].completed = !newTodos[index].completed;
      setPersonalTodos(newTodos);
    } else {
      setTeams(teams.map(team => {
        if (team.name === activePage) {
          const newTodos = [...team.todos];
          newTodos[index].completed = !newTodos[index].completed;
          return { ...team, todos: newTodos };
        }
        return team;
      }));
    }
  };

  // 할 일 삭제 (현재 페이지에 따라)
  const deleteTodo = (index) => {
    if (activePage === 'personal') {
      const newTodos = [...personalTodos];
      newTodos.splice(index, 1);
      setPersonalTodos(newTodos);
    } else {
      setTeams(teams.map(team => {
        if (team.name === activePage) {
          const newTodos = [...team.todos];
          newTodos.splice(index, 1);
          return { ...team, todos: newTodos };
        }
        return team;
      }));
    }
  };

  // todo 수정
  const startEdit = (index, text) => {
    setEditIndex(index);
    setNewText(text);
    setEditModalOpen(true);
  };

  // 수정 저장
  const saveEdit = () => {
    if (newText.trim()) {
      if (activePage === 'personal') {
        const newTodos = [...personalTodos];
        newTodos[editIndex].text = newText;
        setPersonalTodos(newTodos);
      } else {
        setTeams(teams.map(team => {
          if (team.name === activePage) {
            const newTodos = [...team.todos];
            newTodos[editIndex].text = newText;
            return { ...team, todos: newTodos };
          }
          return team;
        }));
      }
      setEditModalOpen(false);
      setNewText('');
      setEditIndex(null);
    }
  };

  // 팀 생성
  const createTeam = (name) => {
    if (name.trim() && !teams.some(team => team.name === name)) {
      setTeams([...teams, { name, todos: [] }]);
    }
  };

  // 팀 삭제
  const removeTeam = (name) => {
    setTeams(teams.filter(team => team.name !== name));
    if (activePage === name) {
      setActivePage('personal'); // 삭제된 팀 페이지라면 개인 페이지로 리디렉션
    }
    setMenuOpen(false);
  };

  // 메뉴 열기
  const openMenu = (teamName) => {
    setSelectedTeam(teamName);
    setMenuOpen(true);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };

    if (menuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [menuOpen]);

  // 현재 페이지의 할 일 목록 가져오기
  const currentTodos = activePage === 'personal' ? personalTodos : teams.find(team => team.name === activePage)?.todos || [];

  const completedTodos = currentTodos.filter(todo => todo.completed);
  const incompleteTodos = currentTodos.filter(todo => !todo.completed);

  return (
    <div className={`app-container ${darkMode ? "dark" : ""}`}>
      <nav>
        <div className="logo">todo-list</div>
        <div className="nav-right">
          <button className="nav-btn" onClick={() => setDarkMode(!darkMode)}>
            {darkMode ? '☀️ 라이트모드' : '🌙 야간모드'}
          </button>
          <button className="nav-btn">로그인</button>
          <button className="nav-btn" onClick={() => setSignupModalOpen(true)}>회원가입</button>
        </div>
      </nav>

      <aside className="sidebar">
        <div className="sidebar-item">
          <button className="todo-btn-indiviual" onClick={() => setActivePage('personal')}>개인 할 일 목록</button>
          {teams.map((team, index) => (
            <button key={index} className="todo-btn-team" onClick={() => setActivePage(team.name)}>
              <span>{team.name + " 할 일 목록"}</span>
              <span className="more-btn" onClick={(e) => { e.stopPropagation(); openMenu(team.name); }}>···</span>
            </button>
          ))}
          <button className="btn-team-create" onClick={() => setTeamModalOpen(true)}>팀 만들기</button>
        </div>
      </aside>

      <div className="main-content">
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
            <h2>{activePage === 'personal' ? 'TO DO' : `${activePage} TO DO`}</h2>
            <ul>
              {incompleteTodos.map((todo, index) => (
                <li key={index}>
                  <input
                    type="checkbox"
                    checked={todo.completed}
                    onChange={() => handleToggle(index)}
                  />
                  <span>{todo.text}</span>
                  <button className="edit-btn" onClick={() => startEdit(index, todo.text)}>수정</button>
                  <button className="delete-btn" onClick={() => deleteTodo(index)}>삭제</button>
                </li>
              ))}
            </ul>
          </div>

          <div className="done-list">
            <h2>{activePage === 'personal' ? 'DONE' : `${activePage} DONE`}</h2>
            <ul>
              {completedTodos.map((todo, index) => (
                <li key={index}>
                  <input type="checkbox" checked={true} disabled />
                  <span>{todo.text}</span>
                  <button className="delete-btn" onClick={() => deleteTodo(index)}>삭제</button>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <TeamModal
          isOpen={teamModalOpen}
          onClose={() => setTeamModalOpen(false)}
          onCreate={createTeam}
          teamName={teamName}
          setTeamName={setTeamName}
        />
      </div>
      {menuOpen && (
        <div className="menu-dropdown" ref={menuRef}>
          <button onClick={() => setInviteModalOpen(true)}>팀원 초대하기</button>
          <button onClick={() => removeTeam(selectedTeam)}>팀 삭제</button>
        </div>
      )}

      <EditModal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        onSave={saveEdit}
        newText={newText}
        setNewText={setNewText}
      />

      <InviteModal
        isOpen={inviteModalOpen}
        onClose={() => setInviteModalOpen(false)}
        teamName={selectedTeam}
        invites={invites}
        setInvites={setInvites}
      />

      <SignupModal
        isOpen={signupModalOpen}
        onClose={() => setSignupModalOpen(false)}
      />
    </div>
  );
}

export default App;