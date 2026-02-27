import { useState } from "react";

'const API = "http://localhost:3000";'
 const API = "http://192.168.18.20:5173";

export default function ValidateBooking() {
  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(false);
  const [booking, setBooking] = useState(null);
  const [error, setError] = useState("");

  const validate = async () => {
    const t = token.trim();
    setError("");
    setBooking(null);

    if (!t) {
      setError("Ingresa un token.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API}/bookings/by-token/${t}`);

      if (res.status === 404) {
        setError("❌ No existe una reserva con ese token.");
        return;
      }

      if (!res.ok) {
        // 400 u otros
        let msg = `Error (${res.status})`;
        try {
          const err = await res.json();
          msg = err?.message || msg;
        } catch {}
        setError(`⚠️ ${msg}`);
        return;
      }

      const data = await res.json();
      if (data?.valid) setBooking(data.booking);
      else setError("❌ Token inválido.");
    } catch {
      setError("No se pudo conectar con el backend.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 720, margin: "40px auto", padding: 16 }}>
      <h2>Validar reserva (token)</h2>

      <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
        <input
          value={token}
          onChange={(e) => setToken(e.target.value)}
          placeholder="Pega el token (UUID)"
          style={{ flex: 1, padding: 10 }}
        />
        <button onClick={validate} disabled={loading} style={{ padding: "10px 14px" }}>
          {loading ? "Validando..." : "Validar"}
        </button>
      </div>

      {error && (
        <div style={{ marginTop: 14, padding: 12, border: "1px solid #555", borderRadius: 8 }}>
          {error}
        </div>
      )}

      {booking && (
        <div style={{ marginTop: 14, padding: 12, border: "1px solid #555", borderRadius: 8 }}>
          <div style={{ fontSize: 18, fontWeight: 700 }}>✅ Reserva válida</div>
          <div style={{ marginTop: 8 }}>
            <div><b>bookingId:</b> {booking.id}</div>
            <div><b>courtId:</b> {booking.courtId}</div>
            <div><b>fecha:</b> {booking.date}</div>
            <div><b>horario:</b> {booking.startHour}:00 - {booking.endHour}:00</div>
            <div><b>personas:</b> {booking.peopleCount}</div>
            <div><b>total:</b> {booking.totalPrice}</div>
            <div style={{ marginTop: 8, wordBreak: "break-all", opacity: 0.9 }}>
              <b>token:</b> {booking.token}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
