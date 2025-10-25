import { useState } from 'react';
import './teamModal.css';

const TeamModal = ({ isOpen, onClose, onCreate, teamName, setTeamName }) => {
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleCreate = async (e) => {
    e.preventDefault();
    setError('');

    if (!teamName.trim()) {
      setError('팀 이름을 입력해주세요.');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('로그인이 필요합니다.');
        return;
      }

      const res = await fetch('http://localhost:4000/api/teams', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ name: teamName })
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || '팀 생성에 실패했습니다.');
        return;
      }

      onCreate(data.team);
      setTeamName('');
      onClose();
    } catch (err) {
      setError('서버 오류가 발생했습니다.');
      console.error('Error creating team:', err);
    }
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <h2>팀 생성</h2>
        <form onSubmit={handleCreate}>
          <input
            type="text"
            value={teamName}
            onChange={(e) => setTeamName(e.target.value)}
            placeholder="팀 이름을 입력하세요"
          />
          {error && <p className="error-message">{error}</p>}
          <button type="submit">생성</button>
          <button type="button" onClick={onClose}>취소</button>
        </form>
      </div>
    </div>
  );
};

export default TeamModal;