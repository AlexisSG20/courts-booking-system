export default function ValidateHero() {
  return (
    <section className="relative overflow-hidden rounded-[28px] border border-white/10 bg-gradient-to-br from-cyan-950/40 via-slate-950 to-slate-900 p-6 shadow-[0_0_0_1px_rgba(255,255,255,0.03)] md:p-8">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(6,182,212,0.16),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(59,130,246,0.14),transparent_30%)]" />

      <div className="relative grid gap-6 lg:grid-cols-[1.4fr_0.9fr]">
        <div>
          <div className="mb-4 flex flex-wrap gap-2">
            <span className="rounded-full border border-cyan-400/20 bg-cyan-500/10 px-3 py-1 text-xs font-medium tracking-[0.2em] text-cyan-300 uppercase">
              Staff access
            </span>
            <span className="rounded-full border border-violet-400/20 bg-violet-500/10 px-3 py-1 text-xs font-medium tracking-[0.2em] text-violet-300 uppercase">
              Token + QR
            </span>
            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium tracking-[0.2em] text-slate-300 uppercase">
              Check-in seguro
            </span>
          </div>

          <p className="mb-3 text-xs uppercase tracking-[0.35em] text-slate-400">
            Courts Booking System
          </p>

          <h1 className="max-w-3xl text-4xl font-semibold leading-tight text-white md:text-5xl">
            Valida reservas por token o QR y registra el ingreso en segundos.
          </h1>

          <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300 md:text-base">
            Pantalla operativa para staff y administradores. Busca una reserva,
            escanea el QR desde cámara y realiza el check-in con una interfaz
            clara, rápida y pensada como producto real.
          </p>
        </div>

        <div className="grid gap-4">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
            <p className="text-sm text-slate-400">Método</p>
            <p className="mt-2 text-3xl font-semibold text-white">Token o QR</p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
            <p className="text-sm text-slate-400">Uso</p>
            <p className="mt-2 text-3xl font-semibold text-white">Check-in</p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
            <p className="text-sm text-slate-400">Acceso</p>
            <p className="mt-2 text-3xl font-semibold text-white">Staff / Admin</p>
          </div>
        </div>
      </div>
    </section>
  );
}