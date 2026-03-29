const heroVisual = {
  backgroundImage:
    "linear-gradient(135deg, rgba(8, 18, 37, 0.84), rgba(15, 23, 42, 0.76) 42%, rgba(37, 99, 235, 0.16)), url('https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=1600&q=80')",
  backgroundSize: "cover",
  backgroundPosition: "center 52%",
};

export default function AdminHero() {
  return (
    <section className="relative isolate overflow-hidden rounded-[2rem] border border-white/16 shadow-[0_24px_80px_rgba(15,23,42,0.24)]">
      <div
        className="absolute inset-0 scale-[1.02] bg-cover bg-no-repeat"
        style={heroVisual}
      />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(16,185,129,0.14),transparent_26%),radial-gradient(circle_at_88%_16%,rgba(56,189,248,0.14),transparent_22%)]" />
      <div className="absolute inset-0 bg-gradient-to-r from-slate-950/78 via-slate-900/66 to-slate-900/48" />

      <div className="relative grid gap-6 p-7 md:p-9 lg:grid-cols-[1.45fr_0.85fr] lg:items-stretch">
        <div className="flex flex-col justify-between">
          <div>
            <div className="mb-4 flex flex-wrap gap-2">
              <span className="rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.28em] text-emerald-100">
                Panel admin
              </span>
              <span className="rounded-full border border-sky-400/30 bg-sky-400/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.28em] text-sky-100">
                Reservas
              </span>
              <span className="rounded-full border border-white/12 bg-white/6 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.28em] text-white/70">
                Control operativo
              </span>
            </div>

            <p className="mb-3 text-xs uppercase tracking-[0.38em] text-white/56">
              Courts Booking System
            </p>

            <h1 className="max-w-4xl text-4xl font-semibold leading-tight tracking-tight text-white md:text-5xl">
              Gestiona reservas, revisa metricas y registra check-in desde una
              sola vista.
            </h1>

            <p className="mt-5 max-w-2xl text-sm leading-7 text-slate-200/82 md:text-base">
              Panel administrativo para filtrar reservas, exportar resultados,
              revisar ingresos y marcar accesos de forma rapida con una interfaz
              mas clara y consistente con el resto del sistema.
            </p>
          </div>
        </div>

        <div className="grid gap-4">
          <div className="rounded-[24px] border border-white/12 bg-slate-950/34 p-5 shadow-sm backdrop-blur-sm">
            <p className="text-sm text-emerald-200">Operacion</p>
            <p className="mt-2 text-2xl font-semibold text-white">
              Filtros + metricas
            </p>
          </div>

          <div className="rounded-[24px] border border-white/12 bg-slate-950/34 p-5 shadow-sm backdrop-blur-sm">
            <p className="text-sm text-sky-200">Accion</p>
            <p className="mt-2 text-2xl font-semibold text-white">
              Check-in manual
            </p>
          </div>

          <div className="rounded-[24px] border border-white/12 bg-slate-950/34 p-5 shadow-sm backdrop-blur-sm">
            <p className="text-sm text-white/56">Reporte</p>
            <p className="mt-2 text-2xl font-semibold text-white">
              Exportacion Excel
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
