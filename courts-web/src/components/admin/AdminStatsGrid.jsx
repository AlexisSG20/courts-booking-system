function StatCard({ label, value, accent = "emerald", align = "left" }) {
  const accentMap = {
    cyan: "bg-cyan-50 border-cyan-200 text-cyan-700",
    emerald: "bg-emerald-50 border-emerald-200 text-emerald-700",
    violet: "bg-violet-50 border-violet-200 text-violet-700",
    rose: "bg-rose-50 border-rose-200 text-rose-700",
    amber: "bg-amber-50 border-amber-200 text-amber-700",
  };

  return (
    <div className="rounded-[26px] border border-gray-200 bg-white p-5 shadow-lg">
      <div
        className={`mb-3 inline-flex rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.28em] ${accentMap[accent]}`}
      >
        {label}
      </div>
      <div className={`text-3xl font-semibold tracking-tight text-gray-900 ${align === "right" ? "text-right" : ""}`}>
        {value}
      </div>
    </div>
  );
}

export default function AdminStatsGrid({ summary, money }) {
  return (
    <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
      <StatCard label="Total reservas" value={summary.total} accent="cyan" />
      <StatCard label="Pendientes" value={summary.pending} accent="amber" />
      <StatCard label="Usadas" value={summary.used} accent="emerald" />
      <StatCard label="Ingresos" value={money(summary.revenue)} accent="violet" align="right" />
      <StatCard label="Personas" value={summary.people} accent="rose" />
    </section>
  );
}