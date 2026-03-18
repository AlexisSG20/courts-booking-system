export default function TimeSlots({
  loadingAvail,
  available,
  selectedHour,
  setSelectedHour,
  creating,
}) {
  return (
    <section className="rounded-[2rem] border border-white/10 bg-slate-900/80 p-7 shadow-xl shadow-black/20 backdrop-blur">
      <div className="mb-7">
        <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
          Disponibilidad
        </p>
        <h2 className="mt-3 text-3xl font-semibold tracking-tight text-white">
          Horas disponibles
        </h2>
        <p className="mt-3 max-w-xl text-sm leading-7 text-slate-400">
          Elige un bloque horario disponible para continuar con tu reserva.
        </p>
      </div>

      {loadingAvail ? (
        <div className="rounded-3xl border border-dashed border-white/10 bg-slate-950/50 p-6 text-sm text-slate-400">
          Cargando disponibilidad...
        </div>
      ) : available.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-white/10 bg-slate-950/50 p-6 text-sm text-slate-400">
          No hay horas disponibles para esta fecha.
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-4">
          {available.map((h) => {
            const isSelected = selectedHour === h;

            return (
              <button
                key={h}
                onClick={() => setSelectedHour(h)}
                disabled={creating}
                className={[
                  "group relative overflow-hidden rounded-3xl border px-4 py-5 text-left transition duration-200",
                  creating
                    ? "cursor-not-allowed opacity-60"
                    : "cursor-pointer hover:-translate-y-0.5 hover:border-cyan-400/40 hover:bg-cyan-400/10",
                  isSelected
                    ? "border-cyan-300 bg-cyan-400/20 shadow-xl shadow-cyan-950/40 ring-2 ring-cyan-300/20"
                    : "border-white/10 bg-slate-950/70",
                ].join(" ")}
              >
                <div className="relative z-10">
                  <p
                    className={[
                      "text-xs uppercase tracking-[0.22em]",
                      isSelected ? "text-cyan-200" : "text-slate-500",
                    ].join(" ")}
                  >
                    Horario
                  </p>

                  <p
                    className={[
                      "mt-2 text-2xl font-semibold tracking-tight",
                      isSelected ? "text-white" : "text-slate-100",
                    ].join(" ")}
                  >
                    {h}:00
                  </p>

                  <p
                    className={[
                      "mt-1 text-sm",
                      isSelected ? "text-cyan-100" : "text-slate-400",
                    ].join(" ")}
                  >
                    {h + 1}:00 cierre
                  </p>
                </div>

                {isSelected && (
                  <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/10 to-sky-400/5" />
                )}
              </button>
            );
          })}
        </div>
      )}
    </section>
  );
}