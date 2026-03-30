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

      <div className="relative z-10 grid gap-6 sm:gap-8 p-4 sm:p-6 lg:p-8 lg:p-10 grid-cols-1 lg:grid-cols-[1.3fr_0.7fr] lg:items-start">
        <div>
          <div className="mb-3 sm:mb-4 flex flex-wrap gap-2 sm:gap-3">
            <span className="rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm">
              {"Reserva rápida"}
            </span>
            <span className="rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm">
              Token QR
            </span>
            <span className="rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm">
              Panel admin
            </span>
          </div>

          <p className="mb-2 sm:mb-3 text-xs uppercase tracking-[0.25em] text-white/70">
            Lozas Deportivas
          </p>

          <h1 className="max-w-3xl text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold tracking-tight text-white">
            Reserva tu cancha en segundos, valida con QR y gestiona todo en un
            solo sistema.
          </h1>

          <p className="mt-3 sm:mt-4 max-w-2xl text-sm sm:text-base lg:text-lg leading-6 sm:leading-7 text-slate-100/88">
            {"Una experiencia moderna para reservas deportivas, con disponibilidad clara,"}
            {" confirmación inmediata y una interfaz pensada para sentirse como producto real."}
          </p>
        </div>

        <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-3 lg:grid-cols-1">
          <div className="rounded-2xl sm:rounded-3xl border border-white/15 bg-white/10 p-4 sm:p-5 backdrop-blur-md">
            <p className="text-xs sm:text-sm text-emerald-200">Disponibilidad</p>
            <p className="mt-2 text-lg sm:text-2xl font-semibold text-white">En tiempo real</p>
          </div>

          <div className="rounded-2xl sm:rounded-3xl border border-white/15 bg-white/10 p-4 sm:p-5 backdrop-blur-md">
            <p className="text-xs sm:text-sm text-emerald-200">Acceso</p>
            <p className="mt-2 text-lg sm:text-2xl font-semibold text-white">Token + QR</p>
          </div>

          <div className="rounded-2xl sm:rounded-3xl border border-white/15 bg-white/10 p-4 sm:p-5 backdrop-blur-md">
            <p className="text-xs sm:text-sm text-emerald-200">{"Gestión"}</p>
            <p className="mt-2 text-lg sm:text-2xl font-semibold text-white">Vista admin</p>
          </div>
        </div>
      </div>
    </section>
  );
}
