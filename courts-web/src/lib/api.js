import { getAccessToken, refreshAccessToken, clearAccessToken } from "./auth";

const API = "/api";

export async function apiFetch(path, options = {}) {
  const { __retry, ...fetchOptions } = options;

  const doRequest = async () => {
    const headers = new Headers(fetchOptions.headers || {});
    const token = getAccessToken();
    if (token) headers.set("Authorization", `Bearer ${token}`);
    headers.delete("X-Admin-PIN");

    return fetch(`${API}${path}`, { ...fetchOptions, headers, credentials: "include" });
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
