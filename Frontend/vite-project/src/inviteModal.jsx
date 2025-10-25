import { useState } from 'react';
import './inviteModal.css';
import { Trash2 } from 'lucide-react'; // lucide-react 아이콘 (npm i lucide-react 필요)

const InviteModal = ({ isOpen, onClose, teamId, invites, setInvites }) => {
  const [email, setEmail] = useState('');
  const [invitedMembers, setInvitedMembers] = useState(invites || []);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleInvite = async (e) => {
    e.preventDefault();
    setError('');
    const trimmed = email.trim();
    if (!trimmed) return;

    if (!teamId) {
      setError('팀이 선택되어 있지 않습니다.');
      return;
    }

    if (invitedMembers.includes(trimmed)) {
      setError('이미 추가된 이메일입니다.');
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      if (!token) {
        setError('로그인이 필요합니다.');
        return;
      }

      const res = await fetch(`http://localhost:4000/api/teams/${teamId}/invite`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ email: trimmed })
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || '초대에 실패했습니다.');
        return;
      }

      const updated = [...invitedMembers, trimmed];
      setInvitedMembers(updated);
      if (setInvites) setInvites(updated);
      setEmail('');
    } catch (err) {
      console.error('Invite error:', err);
      setError('서버 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (targetEmail) => {
    const updated = invitedMembers.filter((member) => member !== targetEmail);
    setInvitedMembers(updated);
    if (setInvites) setInvites(updated);
    // 서버에서 초대 취소 API가 있으면 여기서 호출하도록 확장하세요.
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <h2>팀원 초대</h2>

        <form onSubmit={handleInvite} className="invite-form">
          <input
            type="email"
            value={email}
            onChange={(e) => { setEmail(e.target.value); setError(''); }}
            placeholder="초대할 팀원의 이메일을 입력하세요"
          />
          <button type="submit" className="invite-btn" disabled={loading}>
            {loading ? '초대중...' : '초대'}
          </button>
        </form>

        {error && <p className="error-message">{error}</p>}

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

        <div className="modal-buttons">
          <button className="cancel-btn" onClick={onClose}>닫기</button>
        </div>
      </div>
    </div>
  );
};

export default InviteModal;