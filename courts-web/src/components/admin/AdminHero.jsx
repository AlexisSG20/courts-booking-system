export default function AdminHero() {
  return (
    <section className="relative overflow-hidden rounded-[32px] border border-cyan-400/10 bg-[radial-gradient(circle_at_top_left,rgba(6,182,212,0.18),transparent_30%),linear-gradient(135deg,rgba(2,6,23,0.96),rgba(3,10,30,0.98)_45%,rgba(16,24,39,0.98))] p-7 shadow-[0_30px_80px_rgba(0,0,0,0.35)] md:p-9">
      <div className="grid gap-6 lg:grid-cols-[1.45fr_0.85fr] lg:items-stretch">
        <div className="flex flex-col justify-between">
          <div>
            <div className="mb-4 flex flex-wrap gap-2">
              <span className="rounded-full border border-cyan-400/20 bg-cyan-500/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.28em] text-cyan-200">
                Panel admin
              </span>
              <span className="rounded-full border border-violet-400/20 bg-violet-500/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.28em] text-violet-200">
                Reservas
              </span>
              <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.28em] text-slate-300">
                Control operativo
              </span>
            </div>

            <p className="mb-3 text-xs uppercase tracking-[0.38em] text-slate-400">
              Courts Booking System
            </p>

            <h1 className="max-w-4xl text-4xl font-semibold leading-tight tracking-tight text-white md:text-5xl">
              Gestiona reservas, revisa métricas y registra check-in desde una sola vista.
            </h1>

            <p className="mt-5 max-w-2xl text-sm leading-7 text-slate-300 md:text-base">
              Panel administrativo para filtrar reservas, exportar resultados, revisar ingresos y
              marcar accesos de forma rápida con una interfaz más clara y consistente con el resto
              del sistema.
            </p>
          </div>
        </div>

        <div className="grid gap-4">
          <div className="rounded-[24px] border border-white/10 bg-white/[0.05] p-5 shadow-[0_20px_50px_rgba(0,0,0,0.2)] backdrop-blur-sm">
            <p className="text-sm text-slate-400">Operación</p>
            <p className="mt-2 text-2xl font-semibold text-white">Filtros + métricas</p>
          </div>

          <div className="rounded-[24px] border border-white/10 bg-white/[0.05] p-5 shadow-[0_20px_50px_rgba(0,0,0,0.2)] backdrop-blur-sm">
            <p className="text-sm text-slate-400">Acción</p>
            <p className="mt-2 text-2xl font-semibold text-white">Check-in manual</p>
          </div>

          <div className="rounded-[24px] border border-white/10 bg-white/[0.05] p-5 shadow-[0_20px_50px_rgba(0,0,0,0.2)] backdrop-blur-sm">
            <p className="text-sm text-slate-400">Reporte</p>
            <p className="mt-2 text-2xl font-semibold text-white">Exportación Excel</p>
          </div>
        </div>
      </div>
    </section>
  );
}