function StatCard({ label, value, accent = "emerald", align = "left" }) {
  const accentMap = {
    cyan: "bg-cyan-400/10 border-cyan-400/24 text-cyan-100",
    emerald: "bg-emerald-400/10 border-emerald-400/24 text-emerald-100",
    violet: "bg-violet-400/10 border-violet-400/24 text-violet-100",
    rose: "bg-rose-400/10 border-rose-400/24 text-rose-100",
    amber: "bg-amber-400/10 border-amber-400/24 text-amber-100",
  };

  return (
    <div className="rounded-xl sm:rounded-2xl lg:rounded-[26px] border border-white/12 bg-slate-950/44 p-4 sm:p-5 shadow-[0_24px_80px_rgba(15,23,42,0.18)] backdrop-blur-md">
      <div
        className={`mb-2 sm:mb-3 inline-flex rounded-full border px-2 sm:px-3 py-1 text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.28em] ${accentMap[accent]}`}
      >
        {label}
      </div>
      <div
        className={`text-2xl sm:text-3xl font-semibold tracking-tight text-white ${
          align === "right" ? "text-right" : ""
        }`}
      >
        {value}
      </div>
    </div>
  );
}

export default function AdminStatsGrid({ summary, money }) {
  return (
    <section className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-5">
      <StatCard label="Total reservas" value={summary.total} accent="cyan" />
      <StatCard label="Pendientes" value={summary.pending} accent="amber" />
      <StatCard label="Usadas" value={summary.used} accent="emerald" />
      <StatCard
        label="Ingresos"
        value={money(summary.revenue)}
        accent="violet"
        align="right"
      />
      <StatCard label="Personas" value={summary.people} accent="rose" />
    </section>
  );
}
