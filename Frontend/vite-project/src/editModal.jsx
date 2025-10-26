import { useState, useEffect } from "react";
import "./editModal.css"; // ...existing code...

const EditModal = ({ isOpen, onClose, onSave, newText, setNewText }) => {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setError("");
      setLoading(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSave = async (e) => {
    e.preventDefault();
    setError("");
    const trimmedText = newText.trim();
    if (!trimmedText) {
      setError("수정할 내용을 입력해주세요");
      return;
    }

    if (!onSave) {
      return;
    }

    try {
      setLoading(true);
      const result = await onSave(trimmedText).catch((err) => {
        return {
          success: false,
          error: err?.message || "서버 오류가 발생했습니다.",
        };
      });
      setLoading(false);
      if (!result?.success) {
        setError(result?.error || "할 일 수정에 실패했습니다.");
        return;
      }

      onClose();
    } catch (err) {
      setError("서버 오류가 발생했습니다.");
    } finally {
      setLoading(false);
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
            onChange={(e) => {
              setNewText(e.target.value);
              setError("");
            }}
            placeholder="수정할 내용을 입력하세요"
          />
          {error && <p className="error-message">{error}</p>}
          <button type="submit" disabled={loading}>
            {loading ? "저장중..." : "저장"}
          </button>
          <button type="button" onClick={onClose}>
            취소
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditModal;
