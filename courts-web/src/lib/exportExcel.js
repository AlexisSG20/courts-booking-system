import ExcelJS from "exceljs";

// ── Helpers ──────────────────────────────────────────────────────────

const toNumber = (v) => {
  const n = typeof v === "number" ? v : parseFloat(v ?? "0");
  return Number.isFinite(n) ? n : 0;
};

const pad2 = (n) => String(n).padStart(2, "0");

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

const formatLimaDate = (dt) => {
  const s = formatLimaDateTime(dt);
  return s ? s.slice(0, 10) : "";
};

const formatLimaTime = (dt) => {
  const s = formatLimaDateTime(dt);
  return s ? s.slice(11, 19) : "";
};

// ── Estilos ──────────────────────────────────────────────────────────

const titleStyle = {
  font: { name: "Calibri", size: 18, bold: true, color: { argb: "FF1F4788" } },
  alignment: { vertical: "middle", horizontal: "left" },
};

const sectionTitleStyle = {
  font: { name: "Calibri", size: 14, bold: true, color: { argb: "FF1F4788" } },
  fill: { type: "pattern", pattern: "solid", fgColor: { argb: "FFE8F0FE" } },
  alignment: { vertical: "middle", horizontal: "left" },
};

const headerStyle = {
  font: { name: "Calibri", size: 11, bold: true, color: { argb: "FFFFFFFF" } },
  fill: { type: "pattern", pattern: "solid", fgColor: { argb: "FF4285F4" } },
  alignment: { vertical: "middle", horizontal: "center" },
  border: {
    top: { style: "thin", color: { argb: "FF000000" } },
    left: { style: "thin", color: { argb: "FF000000" } },
    bottom: { style: "thin", color: { argb: "FF000000" } },
    right: { style: "thin", color: { argb: "FF000000" } },
  },
};

const greenHeaderStyle = {
  font: { name: "Calibri", size: 11, bold: true, color: { argb: "FFFFFFFF" } },
  fill: { type: "pattern", pattern: "solid", fgColor: { argb: "FF34A853" } },
  alignment: { vertical: "middle", horizontal: "center" },
  border: {
    top: { style: "thin", color: { argb: "FF000000" } },
    left: { style: "thin", color: { argb: "FF000000" } },
    bottom: { style: "thin", color: { argb: "FF000000" } },
    right: { style: "thin", color: { argb: "FF000000" } },
  },
};

const thinBorder = {
  top: { style: "thin", color: { argb: "FFD3D3D3" } },
  left: { style: "thin", color: { argb: "FFD3D3D3" } },
  bottom: { style: "thin", color: { argb: "FFD3D3D3" } },
  right: { style: "thin", color: { argb: "FFD3D3D3" } },
};

const dataStyle = {
  font: { name: "Calibri", size: 10 },
  alignment: { vertical: "middle", horizontal: "left" },
  border: thinBorder,
};

const numberStyle = {
  font: { name: "Calibri", size: 10 },
  alignment: { vertical: "middle", horizontal: "right" },
  border: thinBorder,
  numFmt: "0",
};

const moneyStyle = {
  font: { name: "Calibri", size: 10 },
  alignment: { vertical: "middle", horizontal: "right" },
  border: thinBorder,
  numFmt: '"S/ "#,##0.00',
};

const percentStyle = {
  font: { name: "Calibri", size: 10 },
  alignment: { vertical: "middle", horizontal: "right" },
  border: thinBorder,
  numFmt: "0%",
};

const dateTimeStyle = {
  font: { name: "Calibri", size: 10 },
  alignment: { vertical: "middle", horizontal: "right" },
  border: thinBorder,
};

const kpiLabelStyle = {
  font: { name: "Calibri", size: 10, bold: true },
  alignment: { vertical: "middle", horizontal: "left" },
  fill: { type: "pattern", pattern: "solid", fgColor: { argb: "FFF3F4F6" } },
};

const kpiValueNumberStyle = {
  font: { name: "Calibri", size: 10 },
  alignment: { vertical: "middle", horizontal: "right" },
  numFmt: "0",
};

const kpiValueMoneyStyle = {
  font: { name: "Calibri", size: 10 },
  alignment: { vertical: "middle", horizontal: "right" },
  numFmt: '"S/ "#,##0.00',
};

const kpiValuePercentStyle = {
  font: { name: "Calibri", size: 10 },
  alignment: { vertical: "middle", horizontal: "right" },
  numFmt: "0%",
};

// ── Función principal ────────────────────────────────────────────────

/**
 * Genera y descarga un archivo Excel con el dashboard de reservas.
 *
 * @param {object} opts
 * @param {Array}  opts.bookings    - lista de reservas
 * @param {object} opts.summary     - indicadores calculados (total, pending, used, revenue, people)
 * @param {Array}  opts.byCourtList - desglose por cancha
 * @param {Array}  opts.courts      - catálogo de canchas
 * @param {string} opts.courtId     - filtro de cancha activo ("" = todas)
 * @param {string} opts.from        - fecha inicio filtro
 * @param {string} opts.to          - fecha fin filtro
 * @param {boolean} opts.pending    - filtro solo pendientes
 */
export async function exportBookingsToExcel({
  bookings = [],
  summary,
  byCourtList,
  courts,
  courtId,
  from,
  to,
  pending,
}) {
  const rangeLabel = from || to ? `${from || "NA"}_${to || "NA"}` : "sin_rango";
  const courtLabel = courtId ? `court_${courtId}` : "todas";
  const pendingLabel = pending ? "pendientes" : "todas";
  const filename = `reservas_${rangeLabel}_${courtLabel}_${pendingLabel}.xlsx`;

  const courtName = courtId
    ? courts.find((x) => String(x.id) === String(courtId))?.name || courtId
    : "Todas";

  // Crear workbook y worksheet
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Reservas", {
    views: [{ state: "frozen", xSplit: 0, ySplit: 1 }],
  });

  // ========== DASHBOARD ==========
  let currentRow = 1;

  // Título principal
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
  worksheet.getCell(`B${currentRow}`).value = pending
    ? "Solo pendientes"
    : "Todas las reservas";
  currentRow++;

  worksheet.getCell(`A${currentRow}`).value = "Filtrar por cancha:";
  worksheet.getCell(`A${currentRow}`).font = { bold: true };
  worksheet.getCell(`B${currentRow}`).value = courtName;
  currentRow += 2;

  // INDICADORES CLAVE
  worksheet.mergeCells(`A${currentRow}:D${currentRow}`);
  const kpiTitleCell = worksheet.getCell(`A${currentRow}`);
  kpiTitleCell.value = "INDICADORES CLAVE";
  kpiTitleCell.style = sectionTitleStyle;
  worksheet.getRow(currentRow).height = 22;
  currentRow += 1;

  const kpis = [
    ["Métrica", "Valor"],
    ["Total de Reservas", summary.total],
    ["Reservas Pendientes", summary.pending],
    ["Reservas Usadas", summary.used],
    ["Ingresos Totales", toNumber(summary.revenue)],
    ["Total de Personas", summary.people],
    ["Ocupación", summary.total > 0 ? summary.used / summary.total : 0],
  ];

  kpis.forEach((kpi, idx) => {
    const cellA = worksheet.getCell(`A${currentRow}`);
    const cellB = worksheet.getCell(`B${currentRow}`);
    cellA.value = kpi[0];
    cellB.value = kpi[1];

    if (idx === 0) {
      cellA.style = headerStyle;
      cellB.style = headerStyle;
      worksheet.getRow(currentRow).height = 20;
    } else {
      cellA.style = kpiLabelStyle;
      if (idx === 4) cellB.style = kpiValueMoneyStyle;
      else if (idx === 6) cellB.style = kpiValuePercentStyle;
      else cellB.style = kpiValueNumberStyle;
      worksheet.getRow(currentRow).height = 18;
    }
    currentRow++;
  });

  // ========== DETALLE DE RESERVAS (lado derecho, columna I) ==========
  let detailRow = 1;
  worksheet.mergeCells(`I${detailRow}:P${detailRow}`);
  const detailTitleCell = worksheet.getCell(`I${detailRow}`);
  detailTitleCell.value = "DETALLE DE RESERVAS";
  detailTitleCell.style = sectionTitleStyle;
  worksheet.getRow(detailRow).height = 22;
  detailRow += 1;

  const headers = [
    "Fecha",
    "Cancha",
    "Inicio",
    "Fin",
    "Personas",
    "Total",
    "Usada - Fecha",
    "Usada - Hora",
  ];
  const headerRowNumber = detailRow;
  headers.forEach((header, idx) => {
    const cell = worksheet.getCell(detailRow, 9 + idx);
    cell.value = header;
    cell.style = headerStyle;
  });
  worksheet.getRow(detailRow).height = 20;
  detailRow++;

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
      const cell = worksheet.getCell(detailRow, 9 + idx);
      cell.value = value;

      if (idx === 5) cell.style = moneyStyle;
      else if (idx === 4) cell.style = numberStyle;
      else if (idx === 6 || idx === 7) cell.style = dateTimeStyle;
      else cell.style = dataStyle;
    });
    worksheet.getRow(detailRow).height = 18;
    detailRow++;
  });

  // AutoFilter
  if (bookings.length > 0) {
    worksheet.autoFilter = {
      from: { row: headerRowNumber, column: 9 },
      to: { row: detailRow - 1, column: 10 },
    };
  }

  // ========== DESGLOSE POR CANCHA (fila 17) ==========
  const breakdownRow = 17;
  if (byCourtList.length > 0) {
    worksheet.mergeCells(`A${breakdownRow}:G${breakdownRow}`);
    const breakdownTitleCell = worksheet.getCell(`A${breakdownRow}`);
    breakdownTitleCell.value = "DESGLOSE POR CANCHA";
    breakdownTitleCell.style = sectionTitleStyle;
    worksheet.getRow(breakdownRow).height = 22;

    let breakdownDataRow = breakdownRow + 1;

    const breakdownHeaders = [
      "Cancha",
      "Total Reservas",
      "Pendientes",
      "Usadas",
      "Personas",
      "Ingresos",
      "%",
    ];
    breakdownHeaders.forEach((header, idx) => {
      const cell = worksheet.getCell(breakdownDataRow, idx + 1);
      cell.value = header;
      cell.style = greenHeaderStyle;
    });
    worksheet.getRow(breakdownDataRow).height = 20;
    breakdownDataRow++;

    byCourtList.forEach((c) => {
      const pct = summary.revenue > 0 ? c.revenue / summary.revenue : 0;
      const rowData = [c.name, c.total, c.pending, c.used, c.people, toNumber(c.revenue), pct];

      rowData.forEach((value, idx) => {
        const cell = worksheet.getCell(breakdownDataRow, idx + 1);
        cell.value = value;

        if (idx === 0) cell.style = dataStyle;
        else if (idx === 5) cell.style = moneyStyle;
        else if (idx === 6) cell.style = percentStyle;
        else cell.style = numberStyle;
      });
      worksheet.getRow(breakdownDataRow).height = 18;
      breakdownDataRow++;
    });
  }

  // ========== ANCHOS DE COLUMNA ==========
  worksheet.columns = [
    { width: 22 }, // A
    { width: 18 }, // B
    { width: 14 }, // C
    { width: 12 }, // D
    { width: 12 }, // E
    { width: 14 }, // F
    { width: 10 }, // G
    { width: 3 },  // H (separador)
    { width: 14 }, // I
    { width: 15 }, // J
    { width: 10 }, // K
    { width: 10 }, // L
    { width: 10 }, // M
    { width: 14 }, // N
    { width: 15 }, // O
    { width: 13 }, // P
  ];

  // ========== DESCARGAR ==========
  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
