import { apiFetch } from "./api";

export async function getMe() {
  const res = await apiFetch("/auth/me");
  if (!res.ok) return null;
  return await res.json(); // ej: { id, email, role }
}