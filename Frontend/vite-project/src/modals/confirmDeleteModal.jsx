import { useState } from 'react';
import './css/confirmDeleteModal.css'; // SignupModal과 유사한 CSS 사용, 필요시 복사

function ConfirmDeleteModal({ isOpen, onClose, onConfirm, darkMode }) {
  if (!isOpen) return null;

  return (
    <div className={`delete-modal ${darkMode ? 'dark-mode' : ''}`}>
      <div className="delete-modal-content">
        <p>정말 삭제하시겠습니까?</p>
        <button type="button" onClick={onConfirm}>확인</button>
        <button type="button" onClick={onClose}>취소</button>
      </div>
    </div>
  );
}

export default ConfirmDeleteModal;