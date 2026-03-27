import { useEffect, useMemo, useState } from "react";
import { apiFetch } from "../lib/api";
import { exportBookingsToExcel } from "../lib/exportExcel";
import { getAccessToken, clearAccessToken } from "../lib/auth";

import AdminHero from "../components/Admin/AdminHero";
import AdminFiltersCard from "../components/Admin/AdminFiltersCard";
import AdminStatsGrid from "../components/Admin/AdminStatsGrid";
import AdminCourtBreakdown from "../components/Admin/AdminCourtBreakdown";
import AdminBookingsTable from "../components/Admin/AdminBookingsTable";

const API = "/api";

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
        throw new Error("No autorizado. Inicia sesión nuevamente.");
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
        throw new Error(j?.message ?? "No autorizado. Inicia sesión nuevamente.");
      }

      if (!r.ok) throw new Error(j?.message ?? `Error (${r.status})`);

      await load();

      if (j?.alreadyUsed) alert("Ya estaba usada.");
      else alert("Check-in realizado ✅");
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
      alert("Token copiado ✅");
    } catch {
      const ta = document.createElement("textarea");
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
      alert("Token copiado ✅");
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
        init.byCourt[id] = { name, total: 0, pending: 0, used: 0, revenue: 0, people: 0 };
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
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-6 md:px-6 lg:px-8">
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
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-slate-300">
          Rango activo: <span className="font-semibold text-white">{from || "—"}</span> →{" "}
          <span className="font-semibold text-white">{to || "—"}</span>
        </div>
      )}

      {error && (
        <div className="rounded-2xl border border-rose-400/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-100">
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
            className="rounded-2xl border border-white/10 bg-white/[0.05] px-4 py-2 text-sm font-semibold text-slate-200 transition hover:bg-white/[0.09]"
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
  );
}