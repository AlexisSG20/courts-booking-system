// Imagen de jugador de fútbol en acción
const slotsVisual = {
  backgroundImage:
    "linear-gradient(135deg, rgba(4, 18, 31, 0.84), rgba(7, 39, 51, 0.74) 42%, rgba(16, 185, 129, 0.22)), url('https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=1600&q=80')",
  backgroundSize: "cover",
  backgroundPosition: "center 30%",
};

export default function TimeSlots({
  available,
  loadingAvail,
  selectedHour,
  setSelectedHour,
  creating,
}) {
  return (
    <section className="relative isolate overflow-hidden rounded-[2rem] border border-white/15 shadow-[0_24px_80px_rgba(15,23,42,0.24)]">
      <div
        className="absolute inset-0 scale-[1.02] bg-cover bg-no-repeat"
        style={slotsVisual}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950/36 via-slate-950/42 to-slate-950/50 backdrop-blur-[0.6px]" />
      <div className="absolute inset-x-0 top-0 h-44 bg-gradient-to-r from-sky-400/8 via-emerald-300/6 to-transparent" />

      <div className="relative z-10 p-4 sm:p-6 lg:p-7">
        <div className="mb-5 sm:mb-6 lg:mb-7">
          <p className="text-xs uppercase tracking-[0.3em] text-white/60">
            Disponibilidad
          </p>
          <h2 className="mt-2 text-xl sm:text-2xl lg:text-3xl font-semibold tracking-tight text-white">
            Horas disponibles
          </h2>
          <p className="mt-2 sm:mt-3 max-w-xl text-xs sm:text-sm leading-6 sm:leading-7 text-slate-200/84">
            Elige un bloque horario disponible para continuar con tu reserva.
          </p>
        </div>

        {loadingAvail ? (
          <div className="rounded-2xl sm:rounded-3xl border border-dashed border-white/15 bg-slate-950/38 p-4 sm:p-6 text-xs sm:text-sm text-white/65 backdrop-blur-sm">
            Cargando disponibilidad...
          </div>
        ) : available.length === 0 ? (
          <div className="rounded-2xl sm:rounded-3xl border border-dashed border-white/15 bg-slate-950/38 p-4 sm:p-6 text-xs sm:text-sm text-white/65 backdrop-blur-sm">
            No hay horas disponibles para esta fecha.
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-2 sm:gap-3 lg:gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {available.map((h) => {
              const isSelected = selectedHour === h;

              return (
                <button
                  key={h}
                  onClick={() => setSelectedHour(h)}
                  disabled={creating}
                  className={[
                    "group relative overflow-hidden rounded-2xl sm:rounded-3xl border px-3 sm:px-4 py-4 sm:py-5 text-left transition duration-200 backdrop-blur-md",
                    creating
                      ? "cursor-not-allowed opacity-60"
                      : "cursor-pointer hover:-translate-y-0.5 hover:border-emerald-400 hover:bg-slate-900/60 hover:shadow-md",
                    isSelected
                      ? "border-emerald-500 bg-emerald-500 shadow-lg ring-2 ring-emerald-500/20"
                      : "border-white/12 bg-slate-950/38",
                  ].join(" ")}
                >
                  <div className="relative z-10">
                    <p
                      className={[
                        "text-xs uppercase tracking-[0.22em]",
                        isSelected ? "text-emerald-100" : "text-white/55",
                      ].join(" ")}
                    >
                      Horario
                    </p>

                    <p className="mt-1 sm:mt-2 text-xl sm:text-2xl font-semibold tracking-tight text-white">
                      {h}:00
                    </p>

                    <p
                      className={[
                        "mt-1 text-xs sm:text-sm",
                        isSelected ? "text-emerald-100" : "text-slate-300/80",
                      ].join(" ")}
                    >
                      {h + 1}:00 cierre
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
