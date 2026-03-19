function StatCard({ label, value, accent = "cyan", align = "left" }) {
  const accentMap = {
    cyan: "from-cyan-400/20 to-cyan-500/5 text-cyan-200",
    emerald: "from-emerald-400/20 to-emerald-500/5 text-emerald-200",
    violet: "from-violet-400/20 to-violet-500/5 text-violet-200",
    rose: "from-rose-400/20 to-rose-500/5 text-rose-200",
    amber: "from-amber-400/20 to-amber-500/5 text-amber-200",
  };

  return (
    <div className="rounded-[26px] border border-white/10 bg-white/[0.04] p-5 shadow-[0_20px_60px_rgba(0,0,0,0.25)] backdrop-blur-sm">
      <div
        className={`mb-3 inline-flex rounded-full border border-white/10 bg-gradient-to-r px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.28em] ${accentMap[accent]}`}
      >
        {label}
      </div>
      <div className={`text-3xl font-semibold tracking-tight text-white ${align === "right" ? "text-right" : ""}`}>
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