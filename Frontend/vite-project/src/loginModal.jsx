import { useState } from "react";
import "./loginModal.css";

function LoginModal({ isOpen, onClose, darkMode }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      console.log("Attempting login with:", { email });
      const res = await fetch("http://localhost:4000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      console.log("Login response: ", data);

      if (!res.ok) {
        alert(data.error || "로그인 실패");
        return;
      }

      // 토큰 저장 전후 확인
      console.log("Token from server:", data.token);
      localStorage.setItem("token", data.token);
      console.log("Stored token:", localStorage.getItem("token"));
      // 로그인 성공 시 토큰 저장
      alert("로그인이 완료되었습니다.");
      onClose();
    } catch (err) {
      console.error("Login error: ", err);
      alert("서버 오류");
    }
  };

  return (
    <div className={`modal ${darkMode ? "dark-mode" : ""}`}>
      <div className="modal-content">
        <h2>로그인</h2>
        <form onSubmit={handleSubmit}>
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
          <button type="submit">로그인</button>
          <button type="button" onClick={onClose}>
            취소
          </button>
        </form>
      </div>
    </div>
  );
}

export default LoginModal;
