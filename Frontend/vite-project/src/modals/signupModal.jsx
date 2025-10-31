import { useState } from "react";
import "../css/signupModal.css";

function SignupModal({ isOpen, onClose, darkMode }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  if (!isOpen) return null;

  const validateEmail = (email) => {
    const emailRegex = /^[\w-]+@([\w-]+\.)+[\w-]{2,4}$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setEmailError("");
    setPasswordError("");

    let isValid = true;

    if (!validateEmail(email)) {
      setEmailError("유효한 이메일 형식이 아닙니다.");
      isValid = false;
    }

    if (password.length < 6) {
      setPasswordError("패스워드는 최소 6글자 이상이어야 합니다.");
      isValid = false;
    }

    if (password !== confirmPassword) {
      alert("패스워드가 일치하지 않습니다.");
      isValid = false;
    }

    if (!isValid) return;

    try {
      const res = await fetch("http://localhost:4000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        alert(data.error || "회원가입 실패");
        return;
      }
      alert("회원가입이 완료되었습니다.");
      onClose();
    } catch (err) {
      alert("서버 오류");
    }
  };

  return (
    <div className={`signup-modal ${darkMode ? "dark-mode" : ""}`}>
      <div className="signup-modal-content">
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
          {emailError && <p className="error">{emailError}</p>}
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="패스워드"
            required
          />
          {passwordError && <p className="error">{passwordError}</p>}
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="패스워드를 다시 입력해주세요."
            required
          />
          <button type="submit">회원가입</button>
          <button type="button" onClick={onClose}>
            취소
          </button>
        </form>
      </div>
    </div>
  );
}

export default SignupModal;
