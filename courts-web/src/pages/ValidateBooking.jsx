import { useEffect, useRef, useState } from "react";
import { BrowserMultiFormatReader } from "@zxing/browser";
import { apiFetch } from "../lib/api";
import { getMe } from "../lib/me";
import { getAccessToken } from "../lib/auth";

import ValidateHero from "../components/validate/ValidateHero";
import TokenValidationCard from "../components/validate/TokenValidationCard";
import ScannerCard from "../components/validate/ScannerCard";
import BookingResultCard from "../components/validate/BookingResultCard";
import ValidateEmptyState from "../components/validate/ValidateEmptyState";

const sidePanelBase =
  "pointer-events-none absolute inset-y-0 z-0 hidden overflow-hidden xl:block";
const sidePanelWidth = "clamp(9rem, calc((100vw - 80rem) / 2 + 1.5rem), 20rem)";

const leftSideVisual = {
  backgroundImage:
    [
      "linear-gradient(90deg, rgba(2, 6, 23, 0.28) 0%, rgba(2, 6, 23, 0.09) 42%, rgba(2, 6, 23, 0.02) 68%, transparent 100%)",
      "radial-gradient(circle at 38% 72%, rgba(255,255,255,0.96) 0 8%, rgba(203,213,225,0.92) 8% 10%, transparent 10.2% 100%)",
      "linear-gradient(145deg, transparent 0 61%, rgba(255,255,255,0.26) 61% 62.4%, transparent 62.4% 100%)",
      "linear-gradient(180deg, rgba(22, 163, 74, 0.9) 0%, rgba(21, 128, 61, 0.92) 100%)",
    ].join(", "),
  backgroundSize: "cover, 100% 100%, 100% 100%, 100% 100%",
  backgroundRepeat: "no-repeat",
  backgroundPosition: "center",
  filter: "saturate(1.04) contrast(1.02) brightness(0.98)",
  WebkitMaskImage:
    "linear-gradient(90deg, rgba(0,0,0,0.98) 0%, rgba(0,0,0,0.94) 60%, rgba(0,0,0,0.58) 80%, transparent 100%)",
  maskImage:
    "linear-gradient(90deg, rgba(0,0,0,0.98) 0%, rgba(0,0,0,0.94) 60%, rgba(0,0,0,0.58) 80%, transparent 100%)",
};

const rightSideVisual = {
  backgroundImage:
    [
      "linear-gradient(270deg, rgba(2, 6, 23, 0.38) 0%, rgba(2, 6, 23, 0.16) 42%, rgba(2, 6, 23, 0.04) 68%, transparent 100%)",
      "radial-gradient(circle at 54% 32%, rgba(255,255,255,0.96) 0 7%, rgba(203,213,225,0.92) 7% 8.8%, transparent 9% 100%)",
      "linear-gradient(205deg, transparent 0 56%, rgba(255,255,255,0.22) 56% 57.2%, transparent 57.2% 100%)",
      "linear-gradient(180deg, rgba(21, 128, 61, 0.94) 0%, rgba(20, 83, 45, 0.96) 100%)",
    ].join(", "),
  backgroundSize: "cover, 100% 100%, 100% 100%, 100% 100%",
  backgroundRepeat: "no-repeat",
  backgroundPosition: "center",
  filter: "saturate(1.06) contrast(1.04) brightness(1.01)",
  WebkitMaskImage:
    "linear-gradient(270deg, rgba(0,0,0,0.98) 0%, rgba(0,0,0,0.94) 60%, rgba(0,0,0,0.58) 80%, transparent 100%)",
  maskImage:
    "linear-gradient(270deg, rgba(0,0,0,0.98) 0%, rgba(0,0,0,0.94) 60%, rgba(0,0,0,0.58) 80%, transparent 100%)",
};

export default function ValidateBooking({ onAuthChange }) {
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

  const [, setMe] = useState(null);

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
        setError("No autorizado. Inicia sesion como STAFF/ADMIN.");
        return;
      }

      if (res.status === 404) {
        setError("No existe una reserva con ese token.");
        return;
      }

      if (!res.ok) {
        const err = await res.json().catch(() => null);
        setError(err?.message ?? `Error (${res.status})`);
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
        setError("No autorizado. Inicia sesion como STAFF/ADMIN.");
        return;
      }

      if (!res.ok) {
        setError(data?.message ?? `Error (${res.status})`);
        return;
      }

      if (data?.booking) setBooking(data.booking);

      if (data?.alreadyUsed) {
        setError("Este token ya fue usado.");
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
      setError("La camara requiere HTTPS (o localhost).");
      return;
    }
    if (!navigator.mediaDevices?.getUserMedia) {
      setError("Este navegador no soporta camara.");
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
          if (!scanningActiveRef.current || !result || scannedRef.current) return;

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
          setError(`No se pudo abrir la camara: ${e?.name ?? "Error"}`);
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
    <main className="relative min-h-[calc(100vh-73px)] overflow-x-hidden bg-transparent text-white">
      <div
        aria-hidden="true"
        className={`${sidePanelBase} left-0 opacity-66`}
        style={{ ...leftSideVisual, width: sidePanelWidth }}
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_24%,rgba(255,255,255,0.08),transparent_22%),linear-gradient(90deg,rgba(2,6,23,0.05)_0%,rgba(2,6,23,0.015)_44%,transparent_80%)]" />
      </div>

      <div
        aria-hidden="true"
        className={`${sidePanelBase} right-0 opacity-70`}
        style={{ ...rightSideVisual, width: sidePanelWidth }}
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_82%_28%,rgba(255,255,255,0.08),transparent_20%),linear-gradient(270deg,rgba(2,6,23,0.05)_0%,rgba(2,6,23,0.015)_44%,transparent_80%)]" />
      </div>

      <div className="relative mx-auto w-full max-w-7xl px-4 py-8 md:px-6 md:py-10">
        <div className="grid gap-8">
          <ValidateHero />

          {error && (
            <div className="rounded-2xl border border-rose-400/24 bg-rose-400/10 px-4 py-3 text-sm text-rose-100">
              {error}
            </div>
          )}

          <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
            <div className="grid gap-6">
              <TokenValidationCard
                token={token}
                setToken={setToken}
                loading={loading}
                scanning={scanning}
                validate={validate}
                startScan={startScan}
                stopScan={stopScan}
              />
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
      </div>
    </main>
  );
}
