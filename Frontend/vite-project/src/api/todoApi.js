const API_URL = "http://localhost:4000/api/todos";
const getAuthToken = () => localStorage.getItem("token");

export const fetchPersonalTodos = async ({
  skipLoading = false,
  silent = false,
  setIsLoading,
  setError,
  setPersonalTodos,
}) => {
  try {
    if (!skipLoading) setIsLoading(true);

    const token = getAuthToken();
    const res = await fetch(API_URL, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json().catch(() => null);

    if (res.ok) {
      const todos = Array.isArray(data) ? data : data?.todos || [];
      setPersonalTodos(todos);
      if (!silent) setError(null);
      return { success: true, todos };
    }

    const message = data?.error || "할 일 목록을 가져오는데 실패했습니다.";
    if (res.status >= 400 && res.status < 500) {
      if (!silent) {
        setError(null);
        alert(message);
      }
    } else if (!silent) {
      setError(message);
    }
    return { success: false, error: message };
  } catch (err) {
    setError("서버 연결에 실패했습니다.");
    console.error("Error fetching personal todos:", err);
    return { success: false, error: err.message };
  } finally {
    if (!skipLoading) setIsLoading(false);
  }
};

export const fetchTeamTodos = async (
  teamId,
  { skipLoading = false, silent = false } = {},
  { setIsLoading, setError, setTeams, checkTeamId }
) => {
  const resolvedTeamId = checkTeamId(teamId);
  if (resolvedTeamId === null) {
    const message = "선택된 팀을 찾을 수 없습니다.";
    if (!silent) setError(message);
    return { success: false, error: message, clientError: true };
  }

  try {
    if (!skipLoading) setIsLoading(true);
    const token = getAuthToken();
    const res = await fetch(`${API_URL}?teamId=${resolvedTeamId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json().catch(() => null);

    if (res.ok) {
      const todos = Array.isArray(data) ? data : data?.todos || [];
      setTeams((prevTeams) =>
        prevTeams.map((team) =>
          team.id === resolvedTeamId ? { ...team, todos } : team
        )
      );
      if (!silent) setError(null);
      return { success: true, todos };
    }

    const message = data?.error || "팀 할 일 목록을 가져오는데 실패했습니다.";
    if (res.status >= 400 && res.status < 500) {
      if (!silent) {
        setError(null);
        alert(message);
      }
      return { success: false, error: message, clientError: true };
    }

    if (!silent) setError(message);
    return { success: false, error: message };
  } catch (err) {
    if (!silent) setError("서버 연결에 실패했습니다.");
    console.error("Error fetching team todos:", err);
    return { success: false, error: "서버 연결에 실패했습니다." };
  } finally {
    if (!skipLoading) setIsLoading(false);
  }
};

export const addTodo = async ({
  title,
  teamId = null,
  setIsLoading,
  setError,
  refreshTodos,
}) => {
  const trimmed = title.trim();
  if (!trimmed) return { success: false, error: "내용을 입력해주세요." };

  try {
    setIsLoading(true);
    const token = getAuthToken();

    const res = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(teamId ? { title: trimmed, teamId } : { title: trimmed }),
    });
    const data = await res.json().catch(() => null);

    if (res.ok) {
      await refreshTodos(teamId);
      setError(null);
      return { success: true };
    }

    const message = data?.error || "할 일 추가에 실패했습니다.";
    alert(message);
    return { success: false, error: message };
  } catch (err) {
    setError("서버 연결에 실패했습니다.");
    return { success: false, error: err.message };
  } finally {
    setIsLoading(false);
  }
};

export const toggleTodo = async ({
  todoId,
  currentDone,
  teamId = null,
  setIsLoading,
  setError,
  refreshTodos,
}) => {
  try {
    setIsLoading(true);
    const token = getAuthToken();

    const res = await fetch(`${API_URL}/${todoId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ done: !currentDone }),
    });
    const data = await res.json().catch(() => null);

    if (res.ok) {
      await refreshTodos(teamId);
      return { success: true };
    }

    alert(data?.error || "상태 변경 실패");
    return { success: false };
  } catch (err) {
    setError("서버 연결에 실패했습니다.");
    return { success: false };
  } finally {
    setIsLoading(false);
  }
};


export const deleteTodo = async ({
  todoId,
  teamId = null,
  setIsLoading,
  setError,
  refreshTodos,
}) => {
  try {
    setIsLoading(true);
    const token = getAuthToken();

    const res = await fetch(`${API_URL}/${todoId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json().catch(() => null);

    if (res.ok) {
      await refreshTodos(teamId);
      return { success: true };
    }

    alert(data?.error || "할 일 삭제 실패");
    return { success: false };
  } catch (err) {
    setError("서버 연결에 실패했습니다.");
    return { success: false };
  } finally {
    setIsLoading(false);
  }
};


export const updateTodo = async ({
  todoId,
  newText,
  teamId = null,
  setIsLoading,
  setError,
  refreshTodos,
}) => {
  try {
    setIsLoading(true);
    const token = getAuthToken();

    const res = await fetch(`${API_URL}/${todoId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ title: newText }),
    });
    const data = await res.json().catch(() => null);

    if (res.ok) {
      await refreshTodos(teamId);
      setError(null);
      return { success: true };
    }

    alert(data?.error || "할 일 수정 실패");
    return { success: false };
  } catch (err) {
    setError("서버 연결에 실패했습니다.");
    return { success: false };
  } finally {
    setIsLoading(false);
  }
};