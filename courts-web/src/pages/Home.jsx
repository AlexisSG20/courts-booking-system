import { useEffect, useMemo, useState } from "react";
import QRCode from "react-qr-code";

'const API = "http://localhost:3000";'
 const API = "/api";


function todayYYYYMMDD() {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

export default function Home() {
  const [courts, setCourts] = useState([]);
  const [courtId, setCourtId] = useState("");
  const [date, setDate] = useState(todayYYYYMMDD());

  const [available, setAvailable] = useState([]);
  const [booked, setBooked] = useState([]);

  const [loadingCourts, setLoadingCourts] = useState(true);
  const [loadingAvail, setLoadingAvail] = useState(false);

  const [selectedHour, setSelectedHour] = useState(null);
  const [peopleCount, setPeopleCount] = useState(1);

  const [creating, setCreating] = useState(false);
  const [confirmation, setConfirmation] = useState(null);
  const [error, setError] = useState("");

  const endHour = useMemo(() => {
    if (selectedHour == null) return null;
    return selectedHour + 1;
  }, [selectedHour]);

  useEffect(() => {
    async function loadCourts() {
      setError("");
      setLoadingCourts(true);
      try {
        const res = await fetch(`${API}/courts`);
        if (!res.ok) throw new Error("Error al cargar courts");
        const data = await res.json();
        setCourts(data);
        if (data.length > 0) setCourtId(String(data[0].id));
      } catch (e) {
        setError(e.message);
      } finally {
        setLoadingCourts(false);
      }
    }
    loadCourts();
  }, []);

  async function loadAvailability(currentCourtId = courtId, currentDate = date) {
    if (!currentCourtId || !currentDate) return;

    setError("");
    setLoadingAvail(true);
    try {
      const res = await fetch(
        `${API}/availability?courtId=${encodeURIComponent(
          currentCourtId
        )}&date=${encodeURIComponent(currentDate)}`
      );

      if (!res.ok) {
        const err = await res.json().catch(() => null);
        throw new Error(err?.message ?? "Error al cargar disponibilidad");
      }

      const data = await res.json();
      setAvailable(data.available ?? []);
      setBooked(data.booked ?? []);
    } catch (e) {
      setError(e.message);
      setAvailable([]);
      setBooked([]);
    } finally {
      setLoadingAvail(false);
    }
  }

  useEffect(() => {
    setSelectedHour(null);
    setConfirmation(null);
    loadAvailability();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [courtId, date]);

  async function createBooking() {
    if (!courtId || !date || selectedHour == null) return;

    setCreating(true);
    setError("");
    setConfirmation(null);

    try {
      const payload = {
        courtId: Number(courtId),
        date,
        startHour: selectedHour,
        endHour: selectedHour + 1,
        peopleCount: Number(peopleCount),
      };

      const res = await fetch(`${API}/bookings`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        const msg =
          (Array.isArray(data?.message) ? data.message.join(", ") : data?.message) ||
          "Error creando reserva";
        throw new Error(msg);
      }

      setConfirmation(data);
      await loadAvailability(courtId, date);
      setSelectedHour(null);
    } catch (e) {
      setError(e.message);
    } finally {
      setCreating(false);
    }
  }

  return (
    <div style={{ fontFamily: "system-ui", padding: 24, maxWidth: 720 }}>
      <h1>Reservas</h1>

      {error && <p style={{ color: "crimson" }}>{error}</p>}

      <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 16 }}>
        <div>
          <label style={{ display: "block", marginBottom: 6 }}>Cancha</label>
          {loadingCourts ? (
            <p>Cargando...</p>
          ) : (
            <select
              value={courtId}
              onChange={(e) => setCourtId(e.target.value)}
              style={{ padding: 10, borderRadius: 8 }}
            >
              {courts.map((c) => (
                <option key={c.id} value={c.id}>
                  #{c.id} — {c.name}
                </option>
              ))}
            </select>
          )}
        </div>

        <div>
          <label style={{ display: "block", marginBottom: 6 }}>Fecha</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            style={{ padding: 10, borderRadius: 8 }}
          />
        </div>

        <div>
          <label style={{ display: "block", marginBottom: 6 }}>Personas</label>
          <input
            type="number"
            min={1}
            value={peopleCount}
            onChange={(e) => setPeopleCount(e.target.value)}
            style={{ padding: 10, borderRadius: 8, width: 120 }}
          />
        </div>
      </div>

      {confirmation && (
        <div
          style={{
            marginBottom: 18,
            padding: 16,
            border: "1px solid #444",
            borderRadius: 12,
          }}
        >
          <h2 style={{ marginTop: 0 }}>✅ Reserva creada</h2>
          <p>
            <b>bookingId:</b> {confirmation.bookingId}
          </p>
          <p>
            <b>Total:</b> {confirmation.totalPrice}
          </p>
          <p>
            <b>Token:</b> {confirmation.token}
          </p>

          <div style={{ background: "white", padding: 12, display: "inline-block", borderRadius: 8 }}>
            <QRCode value={String(confirmation.token)} />
          </div>
        </div>
      )}

      <h2>Horas disponibles</h2>
      {loadingAvail ? (
        <p>Cargando disponibilidad...</p>
      ) : (
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 12 }}>
          {available.length === 0 ? (
            <p>No hay horas disponibles.</p>
          ) : (
            available.map((h) => {
              const isSelected = selectedHour === h;
              return (
                <button
                  key={h}
                  style={{
                    padding: "10px 12px",
                    borderRadius: 10,
                    border: isSelected ? "2px solid #8ab4f8" : "1px solid #555",
                    cursor: "pointer",
                    opacity: creating ? 0.6 : 1,
                  }}
                  disabled={creating}
                  onClick={() => setSelectedHour(h)}
                >
                  {h}:00
                </button>
              );
            })
          )}
        </div>
      )}

      <div style={{ marginBottom: 18 }}>
        <button
          onClick={createBooking}
          disabled={creating || selectedHour == null || !courtId || !date}
          style={{
            padding: "10px 14px",
            borderRadius: 10,
            border: "1px solid #555",
            cursor: creating || selectedHour == null ? "not-allowed" : "pointer",
          }}
        >
          {creating
            ? "Reservando..."
            : selectedHour == null
            ? "Elige una hora para reservar"
            : `Reservar ${selectedHour}:00–${endHour}:00`}
        </button>
      </div>

      <h2>Horas ocupadas</h2>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        {booked.length === 0 ? (
          <p>No hay horas ocupadas.</p>
        ) : (
          booked.map((h) => (
            <span
              key={h}
              style={{
                padding: "8px 10px",
                borderRadius: 10,
                border: "1px solid #333",
                opacity: 0.7,
              }}
            >
              {h}:00
            </span>
          ))
        )}
      </div>
    </div>
  );
}
