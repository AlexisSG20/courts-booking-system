const heroVisual = {
  backgroundImage:
    "linear-gradient(135deg, rgba(6, 23, 39, 0.78), rgba(9, 52, 70, 0.68) 45%, rgba(16, 185, 129, 0.38)), url('https://images.unsplash.com/photo-1518604666860-9ed391f76460?auto=format&fit=crop&w=1600&q=80')",
  backgroundSize: "cover",
  backgroundPosition: "center 72%",
};

export default function HomeHero() {
  return (
    <section className="relative isolate overflow-hidden rounded-[2rem] border border-white/20 shadow-[0_24px_80px_rgba(15,23,42,0.28)]">
      <div
        className="absolute inset-0 scale-[1.02] bg-cover bg-no-repeat"
        style={heroVisual}
      />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.18),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(16,185,129,0.22),transparent_28%)]" />
      <div className="absolute inset-0 bg-gradient-to-r from-slate-950/72 via-slate-900/58 to-slate-900/38" />
      <div className="absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-slate-950/34 to-transparent" />

      <div className="relative z-10 grid gap-8 p-8 lg:grid-cols-[1.3fr_0.7fr] lg:items-end lg:p-10">
        <div>
          <div className="mb-4 flex flex-wrap gap-3">
            <span className="rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm">
              {"Reserva r\u00e1pida"}
            </span>
            <span className="rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm">
              Token QR
            </span>
            <span className="rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm">
              Panel admin
            </span>
          </div>

          <p className="mb-3 text-sm uppercase tracking-[0.25em] text-white/70">
            Courts Booking System
          </p>

          <h1 className="max-w-3xl text-4xl font-bold tracking-tight text-white md:text-5xl">
            Reserva tu cancha en segundos, valida con QR y gestiona todo en un
            solo sistema.
          </h1>

          <p className="mt-4 max-w-2xl text-base leading-7 text-slate-100/88 md:text-lg">
            {"Una experiencia moderna para reservas deportivas, con disponibilidad clara,"}
            {" confirmaci\u00f3n inmediata y una interfaz pensada para sentirse como producto real."}
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
          <div className="rounded-3xl border border-white/15 bg-white/10 p-5 backdrop-blur-md">
            <p className="text-sm text-emerald-200">Disponibilidad</p>
            <p className="mt-2 text-2xl font-semibold text-white">En tiempo real</p>
          </div>

          <div className="rounded-3xl border border-white/15 bg-white/10 p-5 backdrop-blur-md">
            <p className="text-sm text-emerald-200">Acceso</p>
            <p className="mt-2 text-2xl font-semibold text-white">Token + QR</p>
          </div>

          <div className="rounded-3xl border border-white/15 bg-white/10 p-5 backdrop-blur-md">
            <p className="text-sm text-emerald-200">{"Gesti\u00f3n"}</p>
            <p className="mt-2 text-2xl font-semibold text-white">Vista admin</p>
          </div>
        </div>
      </div>
    </section>
  );
}
