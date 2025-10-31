import { useState } from "react";
import "../css/loginModal.css";

function LoginModal({ isOpen, onClose, onLoginSuccess, darkMode }) {
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

      const accessToken = data?.accessToken;

      if (!accessToken) {
        console.error("Login response missing accessToken:", data);
        alert("로그인 응답에 토큰이 없습니다.");
        return;
      }

      // 토큰 저장 전후 확인
      console.log("AccessToken from server:", accessToken);
      localStorage.setItem("token", accessToken);
      console.log("Stored token:", localStorage.getItem("token"));
      if (typeof onLoginSuccess === "function") {
        onLoginSuccess();
      }
      // 로그인 성공 시 토큰 저장
      alert("로그인이 완료되었습니다.");
      onClose();
    } catch (err) {
      console.error("Login error: ", err);
      alert("서버 오류");
    }
  };

  return (
    <div className={`login-modal ${darkMode ? "dark-mode" : ""}`}>
      <div className="login-modal-content">
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
