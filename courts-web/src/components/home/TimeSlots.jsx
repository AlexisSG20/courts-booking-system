export default function TimeSlots({
  loadingAvail,
  available,
  selectedHour,
  setSelectedHour,
  creating,
}) {
  return (
    <section className="rounded-[2rem] border border-emerald-200 bg-gradient-to-b from-white via-emerald-50/50 to-emerald-100/40 p-7 shadow-xl backdrop-blur-sm">
      <div className="mb-7">
        <p className="text-xs uppercase tracking-[0.3em] text-gray-500">
          Disponibilidad
        </p>
        <h2 className="mt-3 text-3xl font-semibold tracking-tight text-gray-900">
          Horas disponibles
        </h2>
        <p className="mt-3 max-w-xl text-sm leading-7 text-gray-600">
          Elige un bloque horario disponible para continuar con tu reserva.
        </p>
      </div>

      {loadingAvail ? (
        <div className="rounded-3xl border border-dashed border-gray-200 bg-gray-50 p-6 text-sm text-gray-500">
          Cargando disponibilidad...
        </div>
      ) : available.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-gray-200 bg-gray-50 p-6 text-sm text-gray-500">
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
                    : "cursor-pointer hover:-translate-y-0.5 hover:border-emerald-400 hover:bg-emerald-50",
                  isSelected
                    ? "border-emerald-500 bg-emerald-500 shadow-lg ring-2 ring-emerald-500/20"
                    : "border-gray-200 bg-white",
                ].join(" ")}
              >
                <div className="relative z-10">
                  <p
                    className={[
                      "text-xs uppercase tracking-[0.22em]",
                      isSelected ? "text-emerald-100" : "text-gray-500",
                    ].join(" ")}
                  >
                    Horario
                  </p>

                  <p
                    className={[
                      "mt-2 text-2xl font-semibold tracking-tight",
                      isSelected ? "text-white" : "text-gray-900",
                    ].join(" ")}
                  >
                    {h}:00
                  </p>

                  <p
                    className={[
                      "mt-1 text-sm",
                      isSelected ? "text-emerald-100" : "text-gray-500",
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
    </section>
  );
}