import { useState } from "react";
import "./css/teamModal.css";

const TeamModal = ({ isOpen, onClose, onCreate, teamName, setTeamName }) => {
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleCreate = async (e) => {
    e.preventDefault();
    setError("");

    const trimmedName = teamName.trim();
    if (!trimmedName) {
      setError("팀 이름을 입력해주세요.");
      return;
    }

    try {
      const result = await onCreate(trimmedName);
      if (result?.success) {
        setTeamName("");
        onClose();
        return;
      }
      if (result?.clientError) {
        setError("");
        alert(result.error);
        return;
      }
      setError(result?.error || "팀 생성에 실패했습니다.");
    } catch (err) {
      setError("서버 오류가 발생했습니다.");
      console.error("Error creating team:", err);
    }
  };

  return (
    <div className="team-modal">
      <div className="team-modal-content">
        <h2>팀 생성</h2>
        <form onSubmit={handleCreate}>
          <input
            type="text"
            value={teamName}
            onChange={(e) => setTeamName(e.target.value)}
            placeholder="팀 이름을 입력하세요"
          />
          {error && <p className="error-message">{error}</p>}
          <button type="submit">생성</button>
          <button type="button" onClick={onClose}>
            취소
          </button>
        </form>
      </div>
    </div>
  );
};

export default TeamModal;
