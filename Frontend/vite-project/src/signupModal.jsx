import { useState } from 'react';
import './signupModal.css';

function SignupModal({ isOpen, onClose, darkMode }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert('패스워드가 일치하지 않습니다.');
      return;
    }
    // 여기서 회원가입 로직 구현 (예: API 호출 또는 콘솔 로그)
    console.log('Signup:', { name, email, password });
    alert('회원가입이 완료되었습니다.');
    onClose();
  };

  return (
    <div className={`modal ${darkMode ? 'dark-mode' : ''}`}>
      <div className="modal-content">
        <h2>회원가입</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="사용자 이름"
            required
          />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="이메일"
            required
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="패스워드"
            required
          />
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="패스워드를 다시 입력해주세요."
            required
          />
          <button type="submit">회원가입</button>
          <button type="button" onClick={onClose}>취소</button>
        </form>
      </div>
    </div>
  );
}

export default SignupModal;