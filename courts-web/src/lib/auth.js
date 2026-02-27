const KEY = "accessToken";
const API = "/api";

export function getAccessToken() {
  return localStorage.getItem(KEY) || "";
}
export function setAccessToken(token) {
  localStorage.setItem(KEY, (token || "").trim());
}
export function clearAccessToken() {
  localStorage.removeItem(KEY);
}

export async function login(email, password) {
  const res = await fetch(`${API}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
    credentials: "include",
  });

  if (!res.ok) throw new Error(`Login failed (${res.status})`);
  const data = await res.json();
  if (data?.accessToken) setAccessToken(data.accessToken);
  return data;
}

// ✅ NUEVO: refresh del access token usando cookie refresh_token
let refreshPromise = null;

export async function refreshAccessToken() {
  if (!refreshPromise) {
    refreshPromise = (async () => {
      const res = await fetch(`${API}/auth/refresh`, {
        method: "POST",
        credentials: "include",
      });

      if (!res.ok) {
        clearAccessToken();
        throw new Error("Refresh failed");
      }

      const data = await res.json();
      if (!data?.accessToken) {
        clearAccessToken();
        throw new Error("No accessToken on refresh");
      }

      setAccessToken(data.accessToken);
      return data.accessToken;
    })().finally(() => {
      refreshPromise = null;
    });
  }

  return refreshPromise;
}

// ✅ NUEVO: logout (limpia cookie refresh en backend)
export async function logout() {
  try {
    await fetch(`${API}/auth/logout`, {
      method: "POST",
      credentials: "include",
    });
  } finally {
    clearAccessToken();
  }
}
