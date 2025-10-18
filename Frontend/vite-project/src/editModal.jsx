import { useState } from 'react';
import './editModal.css'; // CSS 파일은 teamModal.css와 유사하게 만들거나 재사용

const EditModal = ({ isOpen, onClose, onSave, newText, setNewText }) => {
  if (!isOpen) return null;

  const handleSave = (e) => {
    e.preventDefault();
    if (newText.trim()) {
      onSave();
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
            onChange={(e) => setNewText(e.target.value)}
            placeholder="수정할 내용을 입력하세요"
          />
          <button type="submit">저장</button>
          <button type="button" onClick={onClose}>취소</button>
        </form>
      </div>
    </div>
  );
};

export default EditModal;