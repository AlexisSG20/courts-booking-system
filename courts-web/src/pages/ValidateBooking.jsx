import { useEffect, useRef, useState } from "react";
import { BrowserMultiFormatReader } from "@zxing/browser";
import { apiFetch } from "../lib/api";



const API = "/api"; // usando proxy de Vite

export default function ValidateBooking() {
  const scannedRef = useRef(false);
  const readerRef = useRef(null);
  const videoRef = useRef(null);

  const [videoReady, setVideoReady] = useState(false);
  const [scanning, setScanning] = useState(false);

  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(false);
  const [checkingIn, setCheckingIn] = useState(false);

  const [booking, setBooking] = useState(null);
  const [error, setError] = useState("");

  const validate = async (maybeToken) => {
    const t = String(maybeToken ?? token).trim();
    setError("");
    setBooking(null);

    if (!t) {
      setError("Ingresa un token.");
      return;
    }

    setLoading(true);
    try {
      const res = await apiFetch(`/bookings/by-token/${t}`);

      if (res.status === 404) {
        setError("❌ No existe una reserva con ese token.");
        return;
      }

      if (!res.ok) {
        const err = await res.json().catch(() => null);
        setError(`⚠️ ${err?.message ?? `Error (${res.status})`}`);
        return;
      }

      const data = await res.json(); // { valid: true, booking }
      setBooking(data.booking);
    } catch {
      setError("Failed to fetch (backend no reachable)");
    } finally {
      setLoading(false);
    }
  };

  const checkIn = async () => {
    if (!booking?.token) return;

    setCheckingIn(true);
    setError("");

    try {
      const res = await apiFetch(`/bookings/check-in/${booking.token}`, {
        method: "POST",
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        setError(`⚠️ ${data?.message ?? `Error (${res.status})`}`);
        return;
      }

      // backend recomendado: { checkedIn: true/false, alreadyUsed?: true, booking }
      if (data?.booking) setBooking(data.booking);

      if (data?.checkedIn === true) {
        // opcional: mensaje verde, por ahora nada
      } else if (data?.alreadyUsed) {
        setError("🚫 Este token ya fue usado.");
      }
    } catch {
      setError("Failed to fetch (backend no reachable)");
    } finally {
      setCheckingIn(false);
    }
  };

  const startScan = () => {
    setError("");
    setBooking(null);

    if (!window.isSecureContext) {
      setError("La cámara requiere HTTPS (o localhost).");
      return;
    }
    if (!navigator.mediaDevices?.getUserMedia) {
      setError("Este navegador no soporta cámara.");
      return;
    }

    scannedRef.current = false;
    setVideoReady(false);
    setScanning(true);
  };

  const stopScan = () => {
    try {
      readerRef.current?.reset();
    } catch {}
    readerRef.current = null;
    setScanning(false);
  };

  useEffect(() => {
    if (!scanning) return;

    let cancelled = false;

    const run = async () => {
      await new Promise((r) => setTimeout(r, 0));
      if (cancelled) return;

      if (!videoRef.current) {
        setError("No se pudo montar el video.");
        setScanning(false);
        return;
      }

      try {
        const reader = new BrowserMultiFormatReader();
        readerRef.current = reader;

        await reader.decodeFromConstraints(
          { video: { facingMode: "environment" } },
          videoRef.current,
          (result) => {
            if (!result) return;
            if (scannedRef.current) return;

            scannedRef.current = true;
            const text = result.getText();

            setToken(text);
            validate(text);

            setTimeout(() => stopScan(), 250);
          }
        );
      } catch (e) {
        setError(`No se pudo abrir la cámara: ${e?.name ?? "Error"}`);
        setScanning(false);
      }
    };

    run();

    return () => {
      cancelled = true;
      stopScan();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scanning]);

  const isUsed = Boolean(booking?.usedAt);

  return (
    <div style={{ fontFamily: "system-ui", padding: 24, maxWidth: 720 }}>
      <h1>Validar reserva</h1>

      <div style={{ display: "flex", gap: 8, marginTop: 12, flexWrap: "wrap" }}>
        <input
          value={token}
          onChange={(e) => setToken(e.target.value)}
          placeholder="Pega el token (UUID) o escanea QR"
          style={{ flex: 1, minWidth: 260, padding: 10, borderRadius: 8 }}
        />

        <button
          onClick={() => validate()}
          disabled={loading}
          style={{ padding: "10px 14px", borderRadius: 8 }}
        >
          {loading ? "Validando..." : "Validar"}
        </button>

        {!scanning ? (
          <button onClick={startScan} style={{ padding: "10px 14px", borderRadius: 8 }}>
            📷 Escanear QR
          </button>
        ) : (
          <button onClick={stopScan} style={{ padding: "10px 14px", borderRadius: 8 }}>
            ✋ Detener
          </button>
        )}
      </div>

      {scanning && (
        <div style={{ marginTop: 12, padding: 12, border: "1px solid #444", borderRadius: 12 }}>
          <div style={{ marginBottom: 8, opacity: 0.8 }}>Apunta al QR…</div>
          {!videoReady && <div style={{ marginBottom: 8, opacity: 0.8 }}>Iniciando cámara…</div>}

          <video
            ref={videoRef}
            style={{ width: "100%", borderRadius: 12 }}
            muted
            playsInline
            autoPlay
            onPlaying={() => setVideoReady(true)}
          />
        </div>
      )}

      {error && <p style={{ color: "crimson", marginTop: 12 }}>{error}</p>}

      {booking && (
        <div style={{ marginTop: 14, padding: 16, border: "1px solid #444", borderRadius: 12 }}>
          <h2 style={{ marginTop: 0 }}>
            {isUsed ? "🚫 Reserva ya usada" : "✅ Reserva válida"}
          </h2>

          {isUsed && (
            <p>
              <b>usedAt:</b>{" "}
              {new Date(booking.usedAt).toLocaleString()}
            </p>
          )}

          {!isUsed && (
            <button
              onClick={checkIn}
              disabled={checkingIn}
              style={{
                padding: "10px 14px",
                borderRadius: 8,
                marginBottom: 12,
              }}
            >
              {checkingIn ? "Marcando..." : "Marcar como usada (check-in)"}
            </button>
          )}

          <p><b>bookingId:</b> {booking.id}</p>
          <p><b>courtId:</b> {booking.courtId}</p>
          <p><b>fecha:</b> {booking.date}</p>
          <p><b>horario:</b> {booking.startHour}:00 - {booking.endHour}:00</p>
          <p><b>personas:</b> {booking.peopleCount}</p>
          <p><b>total:</b> {booking.totalPrice}</p>
          <p style={{ wordBreak: "break-all" }}><b>token:</b> {booking.token}</p>
        </div>
      )}
    </div>
  );
}
