import { useEffect, useMemo, useState } from "react";
import ExcelJS from "exceljs";
import { apiFetch } from "../lib/api";
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
      const bookings = data?.bookings ?? [];

      const rangeLabel = from || to ? `${from || "NA"}_${to || "NA"}` : "sin_rango";
      const courtLabel = courtId ? `court_${courtId}` : "todas";
      const pendingLabel = pending ? "pendientes" : "todas";
      const filename = `reservas_${rangeLabel}_${courtLabel}_${pendingLabel}.xlsx`;

      const courtName =
        courtId
          ? courts.find((x) => String(x.id) === String(courtId))?.name || courtId
          : "Todas";

      // Crear workbook y worksheet
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("Reservas", {
        views: [{ state: "frozen", xSplit: 0, ySplit: 1 }]
      });

    // ========== ESTILOS ==========
    const titleStyle = {
      font: { name: "Calibri", size: 18, bold: true, color: { argb: "FF1F4788" } },
      alignment: { vertical: "middle", horizontal: "left" }
    };

    const sectionTitleStyle = {
      font: { name: "Calibri", size: 14, bold: true, color: { argb: "FF1F4788" } },
      fill: { type: "pattern", pattern: "solid", fgColor: { argb: "FFE8F0FE" } },
      alignment: { vertical: "middle", horizontal: "left" }
    };

    const headerStyle = {
      font: { name: "Calibri", size: 11, bold: true, color: { argb: "FFFFFFFF" } },
      fill: { type: "pattern", pattern: "solid", fgColor: { argb: "FF4285F4" } },
      alignment: { vertical: "middle", horizontal: "center" },
      border: {
        top: { style: "thin", color: { argb: "FF000000" } },
        left: { style: "thin", color: { argb: "FF000000" } },
        bottom: { style: "thin", color: { argb: "FF000000" } },
        right: { style: "thin", color: { argb: "FF000000" } }
      }
    };

    const greenHeaderStyle = {
      font: { name: "Calibri", size: 11, bold: true, color: { argb: "FFFFFFFF" } },
      fill: { type: "pattern", pattern: "solid", fgColor: { argb: "FF34A853" } },
      alignment: { vertical: "middle", horizontal: "center" },
      border: {
        top: { style: "thin", color: { argb: "FF000000" } },
        left: { style: "thin", color: { argb: "FF000000" } },
        bottom: { style: "thin", color: { argb: "FF000000" } },
        right: { style: "thin", color: { argb: "FF000000" } }
      }
    };

    const dataStyle = {
      font: { name: "Calibri", size: 10 },
      alignment: { vertical: "middle", horizontal: "left" },
      border: {
        top: { style: "thin", color: { argb: "FFD3D3D3" } },
        left: { style: "thin", color: { argb: "FFD3D3D3" } },
        bottom: { style: "thin", color: { argb: "FFD3D3D3" } },
        right: { style: "thin", color: { argb: "FFD3D3D3" } }
      }
    };

    const numberStyle = {
      font: { name: "Calibri", size: 10 },
      alignment: { vertical: "middle", horizontal: "right" },
      border: {
        top: { style: "thin", color: { argb: "FFD3D3D3" } },
        left: { style: "thin", color: { argb: "FFD3D3D3" } },
        bottom: { style: "thin", color: { argb: "FFD3D3D3" } },
        right: { style: "thin", color: { argb: "FFD3D3D3" } }
      },
      numFmt: '0'
    };

    const moneyStyle = {
      font: { name: "Calibri", size: 10 },
      alignment: { vertical: "middle", horizontal: "right" },
      border: {
        top: { style: "thin", color: { argb: "FFD3D3D3" } },
        left: { style: "thin", color: { argb: "FFD3D3D3" } },
        bottom: { style: "thin", color: { argb: "FFD3D3D3" } },
        right: { style: "thin", color: { argb: "FFD3D3D3" } }
      },
      numFmt: '"S/ "#,##0.00'
    };

    const percentStyle = {
      font: { name: "Calibri", size: 10 },
      alignment: { vertical: "middle", horizontal: "right" },
      border: {
        top: { style: "thin", color: { argb: "FFD3D3D3" } },
        left: { style: "thin", color: { argb: "FFD3D3D3" } },
        bottom: { style: "thin", color: { argb: "FFD3D3D3" } },
        right: { style: "thin", color: { argb: "FFD3D3D3" } }
      },
      numFmt: '0%'
    };

    const dateTimeStyle = {
      font: { name: "Calibri", size: 10 },
      alignment: { vertical: "middle", horizontal: "right" },
      border: {
        top: { style: "thin", color: { argb: "FFD3D3D3" } },
        left: { style: "thin", color: { argb: "FFD3D3D3" } },
        bottom: { style: "thin", color: { argb: "FFD3D3D3" } },
        right: { style: "thin", color: { argb: "FFD3D3D3" } }
      }
    };

    const kpiLabelStyle = {
      font: { name: "Calibri", size: 10, bold: true },
      alignment: { vertical: "middle", horizontal: "left" },
      fill: { type: "pattern", pattern: "solid", fgColor: { argb: "FFF3F4F6" } }
    };

    const kpiValueStyle = {
      font: { name: "Calibri", size: 10 },
      alignment: { vertical: "middle", horizontal: "right" }
    };

    const kpiValueNumberStyle = {
      font: { name: "Calibri", size: 10 },
      alignment: { vertical: "middle", horizontal: "right" },
      numFmt: '0'
    };

    const kpiValueMoneyStyle = {
      font: { name: "Calibri", size: 10 },
      alignment: { vertical: "middle", horizontal: "right" },
      numFmt: '"S/ "#,##0.00'
    };

    const kpiValuePercentStyle = {
      font: { name: "Calibri", size: 10 },
      alignment: { vertical: "middle", horizontal: "right" },
      numFmt: '0%'
    };

    // ========== DASHBOARD ==========
    let currentRow = 1;

    // Título principal (solo lado izquierdo)
    worksheet.mergeCells(`A${currentRow}:H${currentRow}`);
    const titleCell = worksheet.getCell(`A${currentRow}`);
    titleCell.value = "DASHBOARD DE RESERVAS";
    titleCell.style = titleStyle;
    worksheet.getRow(currentRow).height = 25;
    currentRow += 2;

    // Información de filtros
    worksheet.getCell(`A${currentRow}`).value = "Período:";
    worksheet.getCell(`A${currentRow}`).font = { bold: true };
    worksheet.getCell(`B${currentRow}`).value = from || "Sin inicio";
    worksheet.getCell(`C${currentRow}`).value = "hasta";
    worksheet.getCell(`D${currentRow}`).value = to || "Sin fin";
    currentRow++;

    worksheet.getCell(`A${currentRow}`).value = "Cancha:";
    worksheet.getCell(`A${currentRow}`).font = { bold: true };
    worksheet.getCell(`B${currentRow}`).value = courtName;
    currentRow++;

    worksheet.getCell(`A${currentRow}`).value = "Filtro:";
    worksheet.getCell(`A${currentRow}`).font = { bold: true };
    worksheet.getCell(`B${currentRow}`).value = pending ? "Solo pendientes" : "Todas las reservas";
    currentRow++;

    // Filtro de cancha para detalles
    worksheet.getCell(`A${currentRow}`).value = "Filtrar por cancha:";
    worksheet.getCell(`A${currentRow}`).font = { bold: true };
    worksheet.getCell(`B${currentRow}`).value = courtName;
    currentRow += 2;

    // INDICADORES CLAVE (lado izquierdo)
    const kpiStartRow = currentRow;
    worksheet.mergeCells(`A${currentRow}:D${currentRow}`);
    const kpiTitleCell = worksheet.getCell(`A${currentRow}`);
    kpiTitleCell.value = "INDICADORES CLAVE";
    kpiTitleCell.style = sectionTitleStyle;
    worksheet.getRow(currentRow).height = 22;
    currentRow += 1;

    // Tabla de KPIs - ajustada para mejor visualización
    const kpis = [
      ["Métrica", "Valor"],
      ["Total de Reservas", summary.total],
      ["Reservas Pendientes", summary.pending],
      ["Reservas Usadas", summary.used],
      ["Ingresos Totales", toNumber(summary.revenue)],
      ["Total de Personas", summary.people],
      ["Ocupación", summary.total > 0 ? (summary.used / summary.total) : 0],
    ];

    kpis.forEach((kpi, idx) => {
      const cellA = worksheet.getCell(`A${currentRow}`);
      const cellB = worksheet.getCell(`B${currentRow}`);
      cellA.value = kpi[0];
      cellB.value = kpi[1];

      if (idx === 0) {
        // Encabezado
        cellA.style = headerStyle;
        cellB.style = headerStyle;
        worksheet.getRow(currentRow).height = 20;
      } else {
        // Datos
        cellA.style = kpiLabelStyle;
        
        if (idx === 4) {
          // Ingresos Totales - formato moneda
          cellB.style = kpiValueMoneyStyle;
        } else if (idx === 6) {
          // Ocupación - formato porcentaje
          cellB.style = kpiValuePercentStyle;
        } else {
          // Total de Reservas, Pendientes, Usadas, Personas - formato numérico
          cellB.style = kpiValueNumberStyle;
        }
        worksheet.getRow(currentRow).height = 18;
      }
      currentRow++;
    });

    // ========== DETALLE DE RESERVAS (lado derecho, empieza en columna I, fila 1) ==========
    let detailRow = 1;
    worksheet.mergeCells(`I${detailRow}:P${detailRow}`);
    const detailTitleCell = worksheet.getCell(`I${detailRow}`);
    detailTitleCell.value = "DETALLE DE RESERVAS";
    detailTitleCell.style = sectionTitleStyle;
    worksheet.getRow(detailRow).height = 22;
    detailRow += 1;

    // Encabezados de tabla (empiezan en columna I, que es la posición 9)
    const headers = ["Fecha", "Cancha", "Inicio", "Fin", "Personas", "Total", "Usada - Fecha", "Usada - Hora"];
    const headerRowNumber = detailRow;
    headers.forEach((header, idx) => {
      const cell = worksheet.getCell(detailRow, 9 + idx); // Columna I es la 9
      cell.value = header;
      cell.style = headerStyle;
    });
    worksheet.getRow(detailRow).height = 20;
    detailRow++;

    // Datos de reservas
    bookings.forEach((b) => {
      const usedDate = b.usedAt ? formatLimaDate(b.usedAt) : "";
      const usedTime = b.usedAt ? formatLimaTime(b.usedAt) : "";

      const rowData = [
        b.date,
        b.court?.name ?? `#${b.courtId}`,
        `${pad2(b.startHour)}:00`,
        `${pad2(b.endHour)}:00`,
        b.peopleCount,
        toNumber(b.totalPrice),
        usedDate,
        usedTime,
      ];

      rowData.forEach((value, idx) => {
        const cell = worksheet.getCell(detailRow, 9 + idx); // Columna I es la 9
        cell.value = value;
        
        if (idx === 5) {
          // Columna Total - formato moneda
          cell.style = moneyStyle;
        } else if (idx === 4) {
          // Columna Personas - formato numérico
          cell.style = numberStyle;
        } else if (idx === 6 || idx === 7) {
          // Columnas Usada + Fecha y Usada + Hora - alineadas a la derecha con tamaño reducido
          cell.style = dateTimeStyle;
        } else {
          // Resto de columnas - sin formato especial
          cell.style = dataStyle;
        }
      });
      worksheet.getRow(detailRow).height = 18;
      detailRow++;
    });

    // Agregar AutoFilter a la tabla de detalles (solo Fecha y Cancha)
    if (bookings.length > 0) {
      // El rango es desde los encabezados (fila headerRowNumber) hasta la última fila de datos
      // Columnas I (9=Fecha) hasta J (10=Cancha)
      worksheet.autoFilter = {
        from: { row: headerRowNumber, column: 9 },
        to: { row: detailRow - 1, column: 10 }
      };
    }

    // ========== DESGLOSE POR CANCHA (debajo de los KPIs, fila 17) ==========
    const breakdownRow = 17;
    if (byCourtList.length > 0) {
      worksheet.mergeCells(`A${breakdownRow}:G${breakdownRow}`);
      const breakdownTitleCell = worksheet.getCell(`A${breakdownRow}`);
      breakdownTitleCell.value = "DESGLOSE POR CANCHA";
      breakdownTitleCell.style = sectionTitleStyle;
      worksheet.getRow(breakdownRow).height = 22;
      
      let breakdownDataRow = breakdownRow + 1;

      // Encabezados
      const breakdownHeaders = ["Cancha", "Total Reservas", "Pendientes", "Usadas", "Personas", "Ingresos", "%"];
      breakdownHeaders.forEach((header, idx) => {
        const cell = worksheet.getCell(breakdownDataRow, idx + 1);
        cell.value = header;
        cell.style = greenHeaderStyle;
      });
      worksheet.getRow(breakdownDataRow).height = 20;
      breakdownDataRow++;

      // Datos por cancha
      byCourtList.forEach((c) => {
        const pct = summary.revenue > 0 ? (c.revenue / summary.revenue) : 0;
        const rowData = [
          c.name,
          c.total,
          c.pending,
          c.used,
          c.people,
          toNumber(c.revenue),
          pct,
        ];

        rowData.forEach((value, idx) => {
          const cell = worksheet.getCell(breakdownDataRow, idx + 1);
          cell.value = value;
          
          if (idx === 0) {
            // Columna Cancha - texto
            cell.style = dataStyle;
          } else if (idx === 5) {
            // Columna Ingresos - formato moneda
            cell.style = moneyStyle;
          } else if (idx === 6) {
            // Columna % - formato porcentaje
            cell.style = percentStyle;
          } else {
            // Total Reservas, Pendientes, Usadas, Personas - formato numérico
            cell.style = numberStyle;
          }
        });
        worksheet.getRow(breakdownDataRow).height = 18;
        breakdownDataRow++;
      });
    }

    // ========== ANCHOS DE COLUMNA ==========
    worksheet.columns = [
      { width: 22 },  // A - Métrica / Cancha (Dashboard)
      { width: 18 },  // B - Valor / Total Reservas
      { width: 14 },  // C - Pendientes
      { width: 12 },  // D - Usadas
      { width: 12 },  // E - Personas (Dashboard)
      { width: 14 },  // F - Ingresos
      { width: 10 },  // G - %
      { width: 3 },   // H - Espacio separador
      { width: 14 },  // I - Fecha (Detalle)
      { width: 15 },  // J - Cancha (Detalle)
      { width: 10 },  // K - Inicio
      { width: 10 },  // L - Fin
      { width: 10 },  // M - Personas (Detalle)
      { width: 14 },  // N - Total
      { width: 15 },  // O - Usada - Fecha
      { width: 13 },  // P - Usada - Hora
    ];

    // ========== DESCARGAR ==========
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { 
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" 
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error al exportar Excel:", error);
      alert(`Error al exportar Excel: ${error.message}`);
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
