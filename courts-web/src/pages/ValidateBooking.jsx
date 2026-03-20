import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BrowserMultiFormatReader } from "@zxing/browser";
import { apiFetch } from "../lib/api";
import { getMe } from "../lib/me";
import { logout as authLogout, getAccessToken } from "../lib/auth";

import ValidateHero from "../components/validate/ValidateHero";
import StaffSessionCard from "../components/validate/StaffSessionCard";
import TokenValidationCard from "../components/validate/TokenValidationCard";
import ScannerCard from "../components/validate/ScannerCard";
import BookingResultCard from "../components/validate/BookingResultCard";
import ValidateEmptyState from "../components/validate/ValidateEmptyState";

export default function ValidateBooking({ onAuthChange }) {
  const navigate = useNavigate();
  const scannedRef = useRef(false);
  const readerRef = useRef(null);
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const scanningActiveRef = useRef(false);

  const [videoReady, setVideoReady] = useState(false);
  const [scanning, setScanning] = useState(false);

  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(false);
  const [checkingIn, setCheckingIn] = useState(false);

  const [booking, setBooking] = useState(null);
  const [error, setError] = useState("");

  const [me, setMe] = useState(null);
  const [authLoading, setAuthLoading] = useState(false);

  const loadMe = async () => {
    if (!getAccessToken()) {
      setMe(null);
      return;
    }
    const u = await getMe();
    setMe(u);
  };

  useEffect(() => {
    loadMe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const doLogout = async () => {
    setError("");
    setAuthLoading(true);
    try {
      await authLogout();
      setMe(null);
      await onAuthChange?.();
      setBooking(null);
      setToken("");
    } catch {
      setMe(null);
      await onAuthChange?.();
      setBooking(null);
      setToken("");
    } finally {
      setAuthLoading(false);
    }
  };

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

      if (res.status === 401 || res.status === 403) {
        setError("🔒 No autorizado. Inicia sesión como STAFF/ADMIN.");
        return;
      }

      if (res.status === 404) {
        setError("❌ No existe una reserva con ese token.");
        return;
      }

      if (!res.ok) {
        const err = await res.json().catch(() => null);
        setError(`⚠️ ${err?.message ?? `Error (${res.status})`}`);
        return;
      }

      const data = await res.json();
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

      if (res.status === 401 || res.status === 403) {
        setError("🔒 No autorizado. Inicia sesión como STAFF/ADMIN.");
        return;
      }

      if (!res.ok) {
        setError(`⚠️ ${data?.message ?? `Error (${res.status})`}`);
        return;
      }

      if (data?.booking) setBooking(data.booking);

      if (data?.checkedIn === true) {
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
    scanningActiveRef.current = true;
    setVideoReady(false);
    setScanning(true);
  };

  const stopScan = () => {
    scanningActiveRef.current = false;
    scannedRef.current = false;

    try {
      readerRef.current?.reset();
    } catch {}

    readerRef.current = null;

    try {
      const stream = streamRef.current;
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    } catch {}

    streamRef.current = null;

    if (videoRef.current) {
      try {
        videoRef.current.pause();
      } catch {}

      try {
        videoRef.current.srcObject = null;
      } catch {}
    }

    setVideoReady(false);
    setScanning(false);
  };

  useEffect(() => {
    if (!scanning) return;

    let cancelled = false;

    const run = async () => {
      await new Promise((r) => setTimeout(r, 0));
      if (cancelled || !scanningActiveRef.current) return;

      if (!videoRef.current) {
        setError("No se pudo montar el video.");
        setScanning(false);
        return;
      }

      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "environment" },
          audio: false,
        });

        if (cancelled || !scanningActiveRef.current) {
          stream.getTracks().forEach((track) => track.stop());
          return;
        }

        streamRef.current = stream;
        videoRef.current.srcObject = stream;

        const reader = new BrowserMultiFormatReader();
        readerRef.current = reader;

        await reader.decodeFromVideoElement(videoRef.current, (result) => {
          if (!scanningActiveRef.current) return;
          if (!result) return;
          if (scannedRef.current) return;

          scannedRef.current = true;

          const text = result.getText();
          setToken(text);
          validate(text);

          setTimeout(() => {
            stopScan();
          }, 250);
        });
      } catch (e) {
        if (!cancelled) {
          setError(`No se pudo abrir la cámara: ${e?.name ?? "Error"}`);
          stopScan();
        }
      }
    };

    run();

    return () => {
      cancelled = true;
      stopScan();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scanning]);

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-8 md:px-6 md:py-10">
      <div className="grid gap-8">
        <ValidateHero />

        <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
          <div className="grid gap-6">
            <StaffSessionCard
              me={me}
              authLoading={authLoading}
              doLogout={doLogout}
              goToAdmin={() => navigate("/admin/bookings")}
              goToLogin={() => navigate("/login")}
            />

            <TokenValidationCard
              token={token}
              setToken={setToken}
              loading={loading}
              scanning={scanning}
              validate={validate}
              startScan={startScan}
              stopScan={stopScan}
            />

            {error && (
              <div className="rounded-2xl border border-rose-400/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
                {error}
              </div>
            )}
          </div>

          <div className="grid gap-6">
            <ValidateEmptyState scanning={scanning} booking={booking} />

            <ScannerCard
              scanning={scanning}
              videoReady={videoReady}
              videoRef={videoRef}
              onVideoPlaying={() => setVideoReady(true)}
            />

            <BookingResultCard
              booking={booking}
              checkingIn={checkingIn}
              checkIn={checkIn}
            />
          </div>
        </div>
      </div>
    </main>
  );
}