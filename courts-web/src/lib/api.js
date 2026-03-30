import { getAccessToken, refreshAccessToken, clearAccessToken } from "./auth";

const API = (import.meta.env.VITE_API_URL || "/api").replace(/\/$/, "");

export function buildApiUrl(path) {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${API}${normalizedPath}`;
}

export async function apiFetch(path, options = {}) {
  const { __retry, ...fetchOptions } = options;

  const doRequest = async () => {
    const headers = new Headers(fetchOptions.headers || {});
    const token = getAccessToken();

    if (token) headers.set("Authorization", `Bearer ${token}`);
    headers.delete("X-Admin-PIN");

    return fetch(buildApiUrl(path), {
      ...fetchOptions,
      headers,
      credentials: "include",
    });
  };

  let res = await doRequest();
  if (res.status !== 401) return res;
  if (__retry) return res;

  try {
    await refreshAccessToken();
    return apiFetch(path, { ...fetchOptions, __retry: true });
  } catch {
    clearAccessToken();
    return res;
  }
}