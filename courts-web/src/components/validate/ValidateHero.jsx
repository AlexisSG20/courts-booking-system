const heroVisual = {
  backgroundImage:
    [
      "linear-gradient(135deg, rgba(6, 23, 39, 0.84), rgba(15, 23, 42, 0.74) 42%, rgba(16, 185, 129, 0.24))",
      "radial-gradient(circle at 50% 50%, rgba(255,255,255,0.12) 0, rgba(255,255,255,0.12) 1px, transparent 1px, transparent 18%)",
      "linear-gradient(90deg, transparent 0 49.5%, rgba(255,255,255,0.18) 49.5% 50.5%, transparent 50.5% 100%)",
      "radial-gradient(circle at 50% 50%, transparent 0 11%, rgba(255,255,255,0.18) 11% 11.8%, transparent 11.8% 100%)",
      "linear-gradient(0deg, transparent 0 14%, rgba(255,255,255,0.15) 14% 14.7%, transparent 14.7% 85.3%, rgba(255,255,255,0.15) 85.3% 86%, transparent 86% 100%)",
      "linear-gradient(90deg, rgba(22, 101, 52, 0.88) 0%, rgba(22, 163, 74, 0.86) 18%, rgba(21, 128, 61, 0.9) 36%, rgba(34, 197, 94, 0.84) 52%, rgba(21, 128, 61, 0.9) 70%, rgba(22, 163, 74, 0.84) 86%, rgba(20, 83, 45, 0.92) 100%)",
    ].join(", "),
  backgroundSize: "cover, 100% 100%, 100% 100%, 100% 100%, 100% 100%, 100% 100%",
  backgroundPosition: "center",
};

export default function ValidateHero() {
  return (
    <section className="relative isolate overflow-hidden rounded-[2rem] border border-white/16 shadow-[0_24px_80px_rgba(15,23,42,0.24)]">
      <div
        className="absolute inset-0 scale-[1.02] bg-cover bg-no-repeat"
        style={heroVisual}
      />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(56,189,248,0.16),transparent_26%),radial-gradient(circle_at_84%_18%,rgba(16,185,129,0.18),transparent_24%)]" />
      <div className="absolute inset-0 bg-gradient-to-r from-slate-950/76 via-slate-900/62 to-slate-900/44" />

      <div className="relative grid gap-6 p-6 md:p-8 lg:grid-cols-[1.4fr_0.9fr]">
        <div>
          <div className="mb-4 flex flex-wrap gap-2">
            <span className="rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-1 text-xs font-medium uppercase tracking-[0.2em] text-emerald-100">
              Staff access
            </span>
            <span className="rounded-full border border-sky-400/30 bg-sky-400/10 px-3 py-1 text-xs font-medium uppercase tracking-[0.2em] text-sky-100">
              Token + QR
            </span>
            <span className="rounded-full border border-white/12 bg-white/6 px-3 py-1 text-xs font-medium uppercase tracking-[0.2em] text-white/70">
              Check-in seguro
            </span>
          </div>

          <p className="mb-3 text-xs uppercase tracking-[0.35em] text-white/56">
            Courts Booking System
          </p>

          <h1 className="max-w-3xl text-4xl font-semibold leading-tight text-white md:text-5xl">
            Valida reservas por token o QR y registra el ingreso en segundos.
          </h1>

          <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-200/84 md:text-base">
            Pantalla operativa para staff y administradores. Busca una reserva,
            escanea el QR desde camara y realiza el check-in con una interfaz
            clara, rapida y pensada como producto real.
          </p>
        </div>

        <div className="grid gap-4">
          <div className="rounded-3xl border border-white/12 bg-slate-950/34 p-5 backdrop-blur-sm">
            <p className="text-sm text-emerald-200">Metodo</p>
            <p className="mt-2 text-3xl font-semibold text-white">Token o QR</p>
          </div>

          <div className="rounded-3xl border border-white/12 bg-slate-950/34 p-5 backdrop-blur-sm">
            <p className="text-sm text-sky-200">Uso</p>
            <p className="mt-2 text-3xl font-semibold text-white">Check-in</p>
          </div>

          <div className="rounded-3xl border border-white/12 bg-slate-950/34 p-5 backdrop-blur-sm">
            <p className="text-sm text-white/56">Acceso</p>
            <p className="mt-2 text-3xl font-semibold text-white">Staff / Admin</p>
          </div>
        </div>
      </div>
    </section>
  );
}
