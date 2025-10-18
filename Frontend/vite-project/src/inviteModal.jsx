import { useState } from 'react';
import './inviteModal.css';
import { Trash2 } from 'lucide-react'; // lucide-react 아이콘 (npm i lucide-react 필요)

const InviteModal = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState('');
  const [invitedMembers, setInvitedMembers] = useState([]);

  if (!isOpen) return null;

  const handleInvite = (e) => {
    e.preventDefault();
    const trimmed = email.trim();
    if (trimmed && !invitedMembers.includes(trimmed)) {
      setInvitedMembers([...invitedMembers, trimmed]);
      setEmail('');
    }
  };

  const handleDelete = (targetEmail) => {
    setInvitedMembers(invitedMembers.filter((member) => member !== targetEmail));
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <h2>팀원 초대</h2>

        {/* 초대 입력 폼 */}
        <form onSubmit={handleInvite} className="invite-form">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="초대할 팀원의 이메일을 입력하세요"
          />
          <button type="submit" className="invite-btn">초대</button>
        </form>

        {/* 초대된 팀원 목록 */}
        <div className="invited-list">
          {invitedMembers.length > 0 ? (
            invitedMembers.map((member, index) => (
              <div key={index} className="invited-item">
                <span className="member-email">{member}</span>
                <button
                  className="delete-btn"
                  onClick={() => handleDelete(member)}
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))
          ) : (
            <p className="no-members">아직 초대한 팀원이 없습니다.</p>
          )}
        </div>

        {/* 하단 버튼 */}
        <div className="modal-buttons">
          <button className="cancel-btn" onClick={onClose}>닫기</button>
        </div>
      </div>
    </div>
  );
};

export default InviteModal;