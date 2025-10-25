import { useState } from 'react';
import './editModal.css'; // ...existing code...

const EditModal = ({ isOpen, onClose, onSave, newText, setNewText, todoId, teamId }) => {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSave = async (e) => {
    e.preventDefault();
    setError('');
    if (!newText.trim()) return;

    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      if (!token) {
        setError('로그인이 필요합니다.');
        return;
      }

      const endpoint = teamId
        ? `http://localhost:4000/api/teams/${teamId}/todo/${todoId}`   // Backend/routes/teams.js: PUT /:id/todo/:todoId
        : `http://localhost:4000/api/todos/${todoId}`;               // 개인 Todo 업데이트 (백엔드에 맞게 경로 확인)

      const res = await fetch(endpoint, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ text: newText })
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || '수정에 실패했습니다.');
        return;
      }

      // onSave 콜백으로 변경된 할일 전달하거나 단순히 리스트 갱신 트리거
      if (onSave) onSave(data.todo || data);
      onClose();
    } catch (err) {
      console.error('Edit error:', err);
      setError('서버 오류가 발생했습니다.');
    } finally {
      setLoading(false);
      setNewText('');
    }
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <h2>할 일 수정</h2>
        <form onSubmit={handleSave}>
          <input
            type="text"
            value={newText}
            onChange={(e) => { setNewText(e.target.value); setError(''); }}
            placeholder="수정할 내용을 입력하세요"
          />
          {error && <p className="error-message">{error}</p>}
          <button type="submit" disabled={loading}>{loading ? '저장중...' : '저장'}</button>
          <button type="button" onClick={onClose}>취소</button>
        </form>
      </div>
    </div>
  );
};

export default EditModal;