import { useEffect, useMemo, useState } from "react";
import { apiFetch } from "../lib/api";
import { exportBookingsToExcel } from "../lib/exportExcel";
import { getAccessToken, clearAccessToken } from "../lib/auth";

import AdminHero from "../components/admin/AdminHero";
import AdminFiltersCard from "../components/admin/AdminFiltersCard";
import AdminStatsGrid from "../components/admin/AdminStatsGrid";
import AdminCourtBreakdown from "../components/admin/AdminCourtBreakdown";
import AdminBookingsTable from "../components/admin/AdminBookingsTable";



const API = "/api";
const sidePanelBase =
  "pointer-events-none absolute inset-y-0 z-0 hidden overflow-hidden xl:block";
const sidePanelWidth = "clamp(9rem, calc((100vw - 80rem) / 2 + 1.5rem), 20rem)";

const leftSideVisual = {
  backgroundImage:
    "linear-gradient(90deg, rgba(2, 6, 23, 0.34) 0%, rgba(2, 6, 23, 0.12) 42%, rgba(2, 6, 23, 0.02) 68%, transparent 100%), url('https://images.unsplash.com/photo-1551958219-acbc608c6377?auto=format&fit=crop&w=1200&h=1800&q=80')",
  backgroundSize: "cover",
  backgroundRepeat: "no-repeat",
  backgroundPosition: "34% center",
  filter: "saturate(1.05) contrast(1.05) brightness(0.92)",
  WebkitMaskImage:
    "linear-gradient(90deg, rgba(0,0,0,0.98) 0%, rgba(0,0,0,0.94) 60%, rgba(0,0,0,0.58) 80%, transparent 100%)",
  maskImage:
    "linear-gradient(90deg, rgba(0,0,0,0.98) 0%, rgba(0,0,0,0.94) 60%, rgba(0,0,0,0.58) 80%, transparent 100%)",
};

const rightSideVisual = {
  backgroundImage:
    "linear-gradient(270deg, rgba(2, 6, 23, 0.44) 0%, rgba(2, 6, 23, 0.18) 42%, rgba(2, 6, 23, 0.04) 68%, transparent 100%), url('https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?auto=format&fit=crop&w=1200&h=1800&q=80')",
  backgroundSize: "cover",
  backgroundRepeat: "no-repeat",
  backgroundPosition: "72% center",
  filter: "saturate(1.06) contrast(1.04) brightness(0.92)",
  WebkitMaskImage:
    "linear-gradient(270deg, rgba(0,0,0,0.98) 0%, rgba(0,0,0,0.94) 60%, rgba(0,0,0,0.58) 80%, transparent 100%)",
  maskImage:
    "linear-gradient(270deg, rgba(0,0,0,0.98) 0%, rgba(0,0,0,0.94) 60%, rgba(0,0,0,0.58) 80%, transparent 100%)",
};

const money = (n) =>
  new Intl.NumberFormat("es-PE", { style: "currency", currency: "PEN" }).format(n);

const toNumber = (v) => {
  const n = typeof v === "number" ? v : parseFloat(v ?? "0");
  return Number.isFinite(n) ? n : 0;
};

const pad2 = (n) => String(n).padStart(2, "0");

const monthRange = (yyyyMm) => {
  const [yStr, mStr] = yyyyMm.split("-");
  const y = Number(yStr);
  const m = Number(mStr);
  const lastDay = new Date(y, m, 0).getDate();

  return {
    from: `${yStr}-${mStr}-01`,
    to: `${yStr}-${mStr}-${pad2(lastDay)}`,
  };
};

const formatLimaDateTime = (dt) => {
  if (!dt) return "";
  const d = typeof dt === "string" ? new Date(dt) : dt;

  return new Intl.DateTimeFormat("sv-SE", {
    timeZone: "America/Lima",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).format(d);
};

export default function AdminBookings() {
  const [courts, setCourts] = useState([]);
  const [courtId, setCourtId] = useState("");
  const [pending, setPending] = useState(false);

  const [month, setMonth] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({ count: 0, bookings: [] });
  const [error, setError] = useState("");

  const [accessToken, setAccessTokenState] = useState(getAccessToken());

  useEffect(() => {
    fetch(`${API}/courts`)
      .then((r) => r.json())
      .then(setCourts)
      .catch(() => setCourts([]));
  }, []);

  useEffect(() => {
    if (!month) return;
    const r = monthRange(month);
    setFrom(r.from);
    setTo(r.to);
  }, [month]);

  const queryString = useMemo(() => {
    const p = new URLSearchParams();

    if (from) p.set("from", from);
    if (to) p.set("to", to);
    if (courtId) p.set("courtId", courtId);
    if (pending) p.set("pending", "true");

    const s = p.toString();
    return s ? `?${s}` : "";
  }, [from, to, courtId, pending]);

  const load = async () => {
    setLoading(true);
    setError("");

    try {
      const r = await apiFetch(`/bookings${queryString}`);

      if (r.status === 401 || r.status === 403) {
        clearAccessToken();
        setAccessTokenState("");
        throw new Error("No autorizado. Inicia sesion nuevamente.");
      }

      const j = await r.json().catch(() => ({}));
      if (!r.ok) throw new Error(j?.message || "Error cargando reservas");

      setData(j);
    } catch (e) {
      setError(e.message || "Error");
      setData({ count: 0, bookings: [] });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!accessToken) return;
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queryString, accessToken]);

  const checkIn = async (token) => {
    if (!confirm("¿Registrar el ingreso de esta reserva?")) return;

    try {
      const r = await apiFetch(`/bookings/check-in/${token}`, { method: "POST" });
      const j = await r.json().catch(() => null);

      if (r.status === 401 || r.status === 403) {
        clearAccessToken();
        setAccessTokenState("");
        throw new Error(j?.message ?? "No autorizado. Inicia sesion nuevamente.");
      }

      if (!r.ok) throw new Error(j?.message ?? `Error (${r.status})`);

      await load();

      if (j?.alreadyUsed) alert("Ya estaba usada.");
      else alert("Check-in realizado.");
    } catch (e) {
      alert(e.message || "Error");
    }
  };

  const clearFilters = () => {
    setMonth("");
    setFrom("");
    setTo("");
    setCourtId("");
    setPending(false);
  };

  const copy = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      alert("Token copiado.");
    } catch {
      const ta = document.createElement("textarea");
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
      alert("Token copiado.");
    }
  };

  const summary = useMemo(() => {
    const bookings = data?.bookings ?? [];
    const init = {
      total: data?.count ?? bookings.length,
      pending: 0,
      used: 0,
      revenue: 0,
      people: 0,
      byCourt: {},
    };

    for (const b of bookings) {
      const isPending = !b.usedAt;
      if (isPending) init.pending += 1;
      else init.used += 1;

      init.revenue += toNumber(b.totalPrice);
      init.people += Number(b.peopleCount ?? 0);

      const id = b.courtId ?? b.court?.id ?? "unknown";
      const name = b.court?.name ?? `#${id}`;

      if (!init.byCourt[id]) {
        init.byCourt[id] = {
          name,
          total: 0,
          pending: 0,
          used: 0,
          revenue: 0,
          people: 0,
        };
      }

      const c = init.byCourt[id];
      c.total += 1;
      if (isPending) c.pending += 1;
      else c.used += 1;
      c.revenue += toNumber(b.totalPrice);
      c.people += Number(b.peopleCount ?? 0);
    }

    init.total = data?.count ?? bookings.length;
    return init;
  }, [data]);

  const byCourtList = useMemo(() => {
    return Object.entries(summary.byCourt)
      .map(([id, v]) => ({ courtId: id, ...v }))
      .sort((a, b) => b.revenue - a.revenue);
  }, [summary.byCourt]);

  const exportExcel = async () => {
    try {
      await exportBookingsToExcel({
        bookings: data?.bookings ?? [],
        summary,
        byCourtList,
        courts,
        courtId,
        from,
        to,
        pending,
      });
    } catch (err) {
      console.error("Error al exportar Excel:", err);
      alert(`Error al exportar Excel: ${err.message}`);
    }
  };

  const showBreakdown = courtId === "";
  const hasBookings = (data.bookings?.length ?? 0) > 0;

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
        className={`${sidePanelBase} right-0 opacity-68`}
        style={{ ...rightSideVisual, width: sidePanelWidth }}
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_82%_28%,rgba(255,255,255,0.08),transparent_20%),linear-gradient(270deg,rgba(2,6,23,0.05)_0%,rgba(2,6,23,0.015)_44%,transparent_80%)]" />
      </div>

      <div className="relative mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-6 md:px-6 lg:px-8">
        <AdminHero />

        <div className="grid gap-6">
          <AdminFiltersCard
            month={month}
            setMonth={setMonth}
            from={from}
            setFrom={setFrom}
            to={to}
            setTo={setTo}
            courtId={courtId}
            setCourtId={setCourtId}
            courts={courts}
            pending={pending}
            setPending={setPending}
            load={load}
            clearFilters={clearFilters}
            exportExcel={exportExcel}
            loading={loading}
            hasBookings={hasBookings}
          />
        </div>

        {(from || to) && (
          <div className="rounded-lg sm:rounded-2xl border border-white/10 bg-white/6 px-4 py-3 text-xs sm:text-sm text-slate-200/76 backdrop-blur-sm">
            Rango activo: <span className="font-semibold text-white">{from || "-"}</span> →{" "}
            <span className="font-semibold text-white">{to || "-"}</span>
          </div>
        )}

        {error && (
          <div className="rounded-lg sm:rounded-2xl border border-rose-400/24 bg-rose-400/10 px-4 py-3 text-xs sm:text-sm text-rose-100">
            {error}
          </div>
        )}

        <AdminStatsGrid summary={summary} money={money} />

        <AdminCourtBreakdown
          showBreakdown={showBreakdown}
          byCourtList={byCourtList}
          summary={summary}
          money={money}
          setCourtId={setCourtId}
        />

        {courtId !== "" && (
          <div>
            <button
              onClick={() => setCourtId("")}
              className="rounded-lg sm:rounded-2xl border border-white/12 bg-white/6 px-4 py-2 text-xs sm:text-sm font-semibold text-white/84 transition hover:bg-white/10"
            >
              Ver todas las canchas
            </button>
          </div>
        )}

        <AdminBookingsTable
          bookings={data.bookings ?? []}
          copy={copy}
          checkIn={checkIn}
          money={money}
          formatLimaDateTime={formatLimaDateTime}
        />
      </div>
    </main>
  );
}
