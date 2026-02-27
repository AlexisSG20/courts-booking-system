import { useEffect, useMemo, useState } from "react";
import { apiFetch } from "../lib/api";
import { exportBookingsToExcel } from "../lib/exportExcel";
import { getAccessToken, login as authLogin, clearAccessToken } from "../lib/auth";
import { logout as authLogout } from "../lib/auth";


const API = "/api";

// Moneda
const money = (n) =>
  new Intl.NumberFormat("es-PE", { style: "currency", currency: "PEN" }).format(n);

const toNumber = (v) => {
  const n = typeof v === "number" ? v : parseFloat(v ?? "0");
  return Number.isFinite(n) ? n : 0;
};

const pad2 = (n) => String(n).padStart(2, "0");

const monthRange = (yyyyMm) => {
  // yyyyMm: "2026-02"
  const [yStr, mStr] = yyyyMm.split("-");
  const y = Number(yStr);
  const m = Number(mStr); // 1..12
  const lastDay = new Date(y, m, 0).getDate(); // día 0 del mes siguiente
  return {
    from: `${yStr}-${mStr}-01`,
    to: `${yStr}-${mStr}-${pad2(lastDay)}`,
  };
};

// ✅ 24h Excel-friendly (evita "p. m." y el "Â")
const formatLimaDateTime = (dt) => {
  if (!dt) return "";
  const d = typeof dt === "string" ? new Date(dt) : dt;

  // "sv-SE" => YYYY-MM-DD HH:mm:ss
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

const formatLimaDate = (dt) => {
  const s = formatLimaDateTime(dt);
  return s ? s.slice(0, 10) : "";
};

const formatLimaTime = (dt) => {
  const s = formatLimaDateTime(dt);
  return s ? s.slice(11, 19) : "";
};

export default function AdminBookings() {
  const [courts, setCourts] = useState([]);
  const [courtId, setCourtId] = useState(""); // string para <select>
  const [pending, setPending] = useState(false);

  // ✅ filtros de rango / mes
  const [month, setMonth] = useState(""); // "YYYY-MM"
  const [from, setFrom] = useState(""); // "YYYY-MM-DD"
  const [to, setTo] = useState(""); // "YYYY-MM-DD"

  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({ count: 0, bookings: [] });
  const [error, setError] = useState("");

  // ✅ JWT session
  const [accessToken, setAccessTokenState] = useState(getAccessToken());
  const [email, setEmail] = useState("admin@courts.com");
  const [password, setPassword] = useState("");
  const [authLoading, setAuthLoading] = useState(false);

  // cargar courts (para el filtro)
  useEffect(() => {
    fetch(`${API}/courts`)
      .then((r) => r.json())
      .then(setCourts)
      .catch(() => setCourts([]));
  }, []);

  // si eligen mes, auto-setea from/to
  useEffect(() => {
    if (!month) return;
    const r = monthRange(month);
    setFrom(r.from);
    setTo(r.to);
  }, [month]);

  const queryString = useMemo(() => {
    const p = new URLSearchParams();

    // ✅ rango
    if (from) p.set("from", from);
    if (to) p.set("to", to);

    // ✅ otros filtros
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

    const doLogin = async () => {
    setAuthLoading(true);
    setError("");

    try {
      await authLogin(email, password); // guarda accessToken en localStorage
      setAccessTokenState(getAccessToken());
      await load();
    } catch (e) {
      clearAccessToken();
      setAccessTokenState("");
      setError(e.message || "Error de login");
    } finally {
      setAuthLoading(false);
    }
  };

  const doLogout = async () => {
    await authLogout();        // pega a /auth/logout y limpia token (si tu auth.js lo hace)
    setAccessTokenState("");   // OJO: State con S mayúscula
    setError("Sesión cerrada");
    setData({ count: 0, bookings: [] });
  };

    useEffect(() => {
    if (!accessToken) return;
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [queryString, accessToken]);

    const checkIn = async (token) => {
      if (!confirm("¿Marcar esta reserva como usada (check-in)?")) return;

      try {
        const r = await apiFetch(`/bookings/check-in/${token}`, { method: "POST" });
        const j = await r.json().catch(() => null);

        if (r.status === 401 || r.status === 403) {
        clearAccessToken();
        setAccessTokenState("");
        throw new Error(j?.message ?? "No autorizado. Inicia sesión nuevamente.");
        }

        if (!r.ok) throw new Error(j?.message ?? `Error (${r.status})`);

        // ✅ NO setData(j) porque j NO trae {count, bookings}
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

  // ✅ Dashboard (calculado desde data.bookings)
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

  // estilos cards
  const cardStyle = {
    border: "1px solid rgba(255,255,255,0.12)",
    borderRadius: 14,
    padding: 12,
    background: "rgba(17,24,39,0.75)",
    color: "#f9fafb",
    boxShadow: "0 6px 18px rgba(0,0,0,0.25)",
    backdropFilter: "blur(6px)",
  };

  const mutedStyle = { color: "rgba(249,250,251,0.65)", fontSize: 12 };
  const bigStyle = { fontSize: 26, fontWeight: 900, marginTop: 6, letterSpacing: 0.2 };

  // breakdown: se oculta cuando filtras por cancha
  const showBreakdown = courtId === "";
  const breakdownWrapStyle = {
    overflow: "hidden",
    maxHeight: showBreakdown ? 500 : 0,
    opacity: showBreakdown ? 1 : 0,
    transform: showBreakdown ? "translateY(0)" : "translateY(-6px)",
    transition: "max-height .18s ease, opacity .18s ease, transform .18s ease",
    pointerEvents: showBreakdown ? "auto" : "none",
  };
  
  return (
    <div style={{ padding: 16, maxWidth: 1100, margin: "0 auto" }}>
      <h2>Admin · Reservas</h2>
      
      {/* ✅ LOGIN JWT */}
      <div style={{ marginBottom: 14, padding: 12, border: "1px solid rgba(255,255,255,0.12)", borderRadius: 12 }}>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "end" }}>
          <div>
            <label>Email</label>
            <br />
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@courts.com"
              style={{ width: 240 }}
            />
          </div>

          <div>
            <label>Contraseña</label>
            <br />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="********"
              style={{ width: 200 }}
            />
          </div>

          <button onClick={doLogin} disabled={authLoading || !email || !password}>
            {authLoading ? "Entrando..." : "Entrar"}
          </button>

          <button onClick={doLogout} disabled={!accessToken}>
            Salir
          </button>

          <div style={{ opacity: 0.75, fontSize: 12 }}>
            {accessToken ? "✅ Sesión activa" : "🔒 Sin sesión"}
          </div>
        </div>
      </div>

      {/* FILTROS */}
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "end" }}>
        <div>
          <label>Mes</label>
          <br />
          <input type="month" value={month} onChange={(e) => setMonth(e.target.value)} />
        </div>

        <div>
          <label>Desde</label>
          <br />
          <input
            type="date"
            value={from}
            onChange={(e) => {
              setFrom(e.target.value);
              setMonth("");
            }}
          />
        </div>

        <div>
          <label>Hasta</label>
          <br />
          <input
            type="date"
            value={to}
            onChange={(e) => {
              setTo(e.target.value);
              setMonth("");
            }}
          />
        </div>

        <div>
          <label>Cancha</label>
          <br />
          <select value={courtId} onChange={(e) => setCourtId(e.target.value)}>
            <option value="">Todas</option>
            {courts.map((c) => (
              <option key={c.id} value={String(c.id)}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <label style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 2 }}>
          <input type="checkbox" checked={pending} onChange={(e) => setPending(e.target.checked)} />
          Solo pendientes
        </label>

        <button onClick={load} disabled={loading}>
          {loading ? "Cargando..." : "Refrescar"}
        </button>

        <button onClick={clearFilters} disabled={loading}>
          Limpiar filtros
        </button>

        {/* ✅ Botón exportar Excel con formato */}
        <button onClick={exportExcel} disabled={loading || (data.bookings?.length ?? 0) === 0}>
          Exportar Excel
        </button>
      </div>

      {(from || to) && (
        <p style={{ marginTop: 10, ...mutedStyle }}>
          Rango: <b>{from || "—"}</b> → <b>{to || "—"}</b>
        </p>
      )}

      {error && <p style={{ color: "crimson" }}>{error}</p>}

      {/* DASHBOARD */}
      <div
        style={{
          display: "grid",
          gap: 12,
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          marginTop: 12,
          marginBottom: 12,
        }}
      >
        <div className="kpi-card" style={cardStyle}>
          <div style={mutedStyle}>Total reservas</div>
          <div style={bigStyle}>{summary.total}</div>
        </div>

        <div className="kpi-card" style={cardStyle}>
          <div style={mutedStyle}>Pendientes</div>
          <div style={bigStyle}>{summary.pending}</div>
        </div>

        <div className="kpi-card" style={cardStyle}>
          <div style={mutedStyle}>Usadas</div>
          <div style={bigStyle}>{summary.used}</div>
        </div>

        <div className="kpi-card" style={cardStyle}>
          <div style={mutedStyle}>Ingresos</div>
          <div style={{ ...bigStyle, textAlign: "right" }}>{money(summary.revenue)}</div>
        </div>

        <div className="kpi-card" style={cardStyle}>
          <div style={mutedStyle}>Personas</div>
          <div style={bigStyle}>{summary.people}</div>
        </div>
      </div>

      {/* Breakdown */}
      <div style={breakdownWrapStyle}>
        {courts.length > 0 && byCourtList.length >= 1 && (
          <div style={{ ...cardStyle, marginBottom: 12 }}>
            <div style={{ ...mutedStyle, marginBottom: 8 }}>Por cancha</div>

            <div style={{ display: "grid", gap: 10 }}>
              {byCourtList.map((c) => {
                const pct =
                  summary.revenue > 0 ? Math.round((c.revenue / summary.revenue) * 100) : 0;

                return (
                  <div
                    key={String(c.courtId)}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      gap: 12,
                      alignItems: "center",
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: 700 }}>
                        {c.name} <span style={{ ...mutedStyle, fontWeight: 600 }}>· {pct}%</span>
                      </div>
                      <div style={mutedStyle}>
                        {c.total} total · {c.pending} pend · {c.used} usadas · {c.people} pers
                      </div>
                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div style={{ fontWeight: 800 }}>{money(c.revenue)}</div>
                      <button
                        onClick={() => setCourtId(String(c.courtId))}
                        style={{ padding: "4px 10px", cursor: "pointer" }}
                      >
                        Filtrar
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {courtId !== "" && (
        <div style={{ marginBottom: 10 }}>
          <button onClick={() => setCourtId("")} style={{ padding: "4px 10px", cursor: "pointer" }}>
            Ver todas
          </button>
        </div>
      )}

      {/* TABLA */}
      <div style={{ overflowX: "auto" }}>
        <table border="1" cellPadding="8" style={{ borderCollapse: "collapse", width: "100%" }}>
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Cancha</th>
              <th>Horario</th>
              <th>Personas</th>
              <th>Total</th>
              <th>Token</th>
              <th>Usada</th>
            </tr>
          </thead>
          <tbody>
            {(data.bookings ?? []).map((b) => (
              <tr key={b.id}>
                <td>{b.date}</td>
                <td>{b.court?.name ?? `#${b.courtId}`}</td>
                <td>
                  {b.startHour}:00 - {b.endHour}:00
                </td>
                <td>{b.peopleCount}</td>
                <td>{b.totalPrice}</td>
                <td style={{ fontFamily: "monospace", fontSize: 12 }}>
                  {b.token}{" "}
                  <button
                    onClick={() => copy(b.token)}
                    style={{ marginLeft: 8, padding: "2px 8px", cursor: "pointer" }}
                  >
                    Copiar
                  </button>
                </td>
                <td>
                  {b.usedAt ? (
                    new Date(b.usedAt).toLocaleString()
                  ) : (
                    <button
                      onClick={() => checkIn(b.token)}
                      style={{ padding: "2px 10px", cursor: "pointer" }}
                    >
                      Check-in
                    </button>
                  )}
                </td>
              </tr>
            ))}

            {data.bookings.length === 0 && (
              <tr>
                <td colSpan="7" style={{ textAlign: "center" }}>
                  Sin reservas
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
