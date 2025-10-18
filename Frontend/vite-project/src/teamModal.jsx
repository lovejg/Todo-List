import { useState } from 'react';
import './teamModal.css';

const TeamModal = ({ isOpen, onClose, onCreate, teamName, setTeamName }) => {
  if (!isOpen) return null;

  const handleCreate = (e) => {
    e.preventDefault();
    if (teamName.trim()) {
      onCreate(teamName);
      setTeamName('');
      onClose();
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
          <button type="submit">생성</button>
          <button type="button" onClick={onClose}>취소</button>
        </form>
      </div>
    </div>
  );
};

export default TeamModal;