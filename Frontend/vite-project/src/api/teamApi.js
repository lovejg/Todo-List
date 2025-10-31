const API_URL = "http://localhost:4000/api/teams";
const getAuthToken = () => localStorage.getItem("token");

export const fetchTeams = async (
  { skipLoading = false, silent = false } = {},
  { setIsLoading, setError, setTeams }
) => {
  try {
    if (!skipLoading) setIsLoading(true);
    const token = getAuthToken();
    const res = await fetch(API_URL, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json().catch(() => null);

    if (res.ok) {
      const teamsData = Array.isArray(data) ? data : data?.teams || [];
      setTeams((prevTeams) =>
        teamsData.map((team) => {
          const existing = prevTeams.find((prev) => prev.id === team.id);
          return { ...team, todos: existing?.todos || [] };
        })
      );
      if (!silent) setError(null);
      return { success: true };
    }

    const message = data?.error || "팀 목록을 가져오는데 실패했습니다.";
    if (!silent) setError(message);
    return { success: false, error: message };
  } catch (err) {
    if (!silent) setError("서버 연결에 실패했습니다.");
    console.error("Error fetching teams:", err);
    return { success: false, error: "서버 연결에 실패했습니다." };
  } finally {
    if (!skipLoading) setIsLoading(false);
  }
};

export const createTeam = async (
  name,
  { setIsLoading, setError, fetchTeams }
) => {
  const trimmedName = name.trim();
  if (!trimmedName) {
    return { success: false, error: "팀 이름을 입력해주세요." };
  }
  try {
    setIsLoading(true);
    const token = getAuthToken();
    if (!token) {
      const message = "로그인이 필요합니다.";
      setError(message);
      return { success: false, error: message };
    }

    const res = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ name: trimmedName }),
    });

    if (res.ok) {
      await fetchTeams({ skipLoading: true });
      setError(null);
      return { success: true };
    }

    const data = await res.json().catch(() => null);
    const message = data?.error || "팀 생성에 실패했습니다.";
    if (res.status >= 400 && res.status < 500) {
      return { success: false, error: message, clientError: true };
    }
    setError(message);
    return { success: false, error: message };
  } catch (err) {
    const message = "서버 연결에 실패했습니다.";
    setError(message);
    return { success: false, error: message };
  } finally {
    setIsLoading(false);
  }
};

export const removeTeam = async ({
  teamId,
  activePage,
  checkTeamId,
  setActivePage,
  setIsLoading,
  setError,
  setMenuOpen,
  fetchTeams,
}) => {
  try {
    setIsLoading(true);
    const token = getAuthToken();
    const res = await fetch(`${TEAM_URL}/${teamId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json().catch(() => null);

    if (res.ok) {
      if (checkTeamId(activePage) === checkTeamId(teamId)) {
        setActivePage("personal");
      }
      await fetchTeams({ setIsLoading, setError, setTeams: fetchTeams.setTeams });
      setMenuOpen(false);
      return { success: true };
    }

    alert(data?.error || "팀 삭제 실패");
    return { success: false };
  } catch (err) {
    setError("서버 연결에 실패했습니다.");
    return { success: false };
  } finally {
    setIsLoading(false);
  }
};