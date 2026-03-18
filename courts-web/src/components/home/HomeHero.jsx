export default function HomeHero() {
  return (
    <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 p-8 shadow-2xl shadow-black/30">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.18),transparent_28%),radial-gradient(circle_at_bottom_left,rgba(16,185,129,0.14),transparent_24%)]" />

      <div className="relative z-10 grid gap-8 lg:grid-cols-[1.3fr_0.7fr] lg:items-end">
        <div>
          <div className="mb-4 flex flex-wrap gap-3">
            <span className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-xs font-medium text-cyan-300">
              Reserva rápida
            </span>
            <span className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-xs font-medium text-emerald-300">
              Token QR
            </span>
            <span className="rounded-full border border-violet-400/20 bg-violet-400/10 px-3 py-1 text-xs font-medium text-violet-300">
              Panel admin
            </span>
          </div>

          <p className="mb-3 text-sm uppercase tracking-[0.25em] text-slate-400">
            Courts Booking System
          </p>

          <h1 className="max-w-3xl text-4xl font-bold tracking-tight text-white md:text-5xl">
            Reserva tu cancha en segundos, valida con QR y gestiona todo en un solo sistema.
          </h1>

          <p className="mt-4 max-w-2xl text-base leading-7 text-slate-300 md:text-lg">
            Una experiencia moderna para reservas deportivas, con disponibilidad clara,
            confirmación inmediata y una interfaz pensada para sentirse como producto real.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur">
            <p className="text-sm text-slate-400">Disponibilidad</p>
            <p className="mt-2 text-2xl font-semibold text-white">En tiempo real</p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur">
            <p className="text-sm text-slate-400">Acceso</p>
            <p className="mt-2 text-2xl font-semibold text-white">Token + QR</p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur">
            <p className="text-sm text-slate-400">Gestión</p>
            <p className="mt-2 text-2xl font-semibold text-white">Vista admin</p>
          </div>
        </div>
      </div>
    </section>
  );
}