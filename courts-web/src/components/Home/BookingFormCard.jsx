import DatePicker from "../admin/DatePicker";

// Imagen de estadio/cancha nocturna
const bookingVisual = {
  backgroundImage:
    "linear-gradient(135deg, rgba(4, 18, 31, 0.82), rgba(7, 39, 51, 0.72) 42%, rgba(16, 185, 129, 0.28)), url('https://images.unsplash.com/photo-1459865264687-595d652de67e?auto=format&fit=crop&w=1600&q=80')",
  backgroundSize: "cover",
  backgroundPosition: "center 60%",
};

export default function BookingFormCard({
  courts,
  courtId,
  setCourtId,
  date,
  setDate,
  peopleCount,
  setPeopleCount,
  loadingCourts,
  creating,
  selectedHour,
  endHour,
  onCreateBooking,
}) {
  return (
    <section className="relative z-20 isolate overflow-hidden rounded-[2rem] border border-white/15 shadow-[0_24px_80px_rgba(15,23,42,0.24)]">
      <div
        className="absolute inset-0 scale-[1.02] bg-cover bg-no-repeat"
        style={bookingVisual}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950/34 via-slate-950/40 to-slate-950/48 backdrop-blur-[0.6px]" />
      <div className="absolute inset-x-0 top-0 h-44 bg-gradient-to-r from-emerald-400/8 via-cyan-300/6 to-transparent" />

      <div className="relative z-10 p-7">
        <div className="mb-7">
          <p className="text-xs uppercase tracking-[0.3em] text-white/60">
            Nueva reserva
          </p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-white">
            Elige tu cancha y horario
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-200/84">
            Selecciona la cancha, la fecha y la cantidad de personas. Luego elige
            una hora disponible para generar tu reserva.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          <div>
            <label className="mb-2 block text-sm font-medium text-white/80">
              Cancha
            </label>

            {loadingCourts ? (
              <div className="flex h-14 items-center rounded-2xl border border-white/15 bg-slate-950/38 px-4 text-sm text-white/65 backdrop-blur-sm">
                Cargando...
              </div>
            ) : (
              <select
                value={courtId}
                onChange={(e) => setCourtId(e.target.value)}
                className="h-14 w-full cursor-pointer appearance-none rounded-2xl border border-white/15 bg-slate-950/38 px-4 text-base text-white outline-none backdrop-blur-sm transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20"
              >
                {courts.map((c) => (
                  <option key={c.id} value={c.id} className="bg-slate-900 text-white">
                    {`#${c.id} \u2014 ${c.name}`}
                  </option>
                ))}
              </select>
            )}
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-white/80">
              Fecha
            </label>
            <DatePicker
              value={date}
              onChange={setDate}
              placeholder="Seleccionar fecha"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-white/80">
              Personas
            </label>
            <input
              type="number"
              min={1}
              value={peopleCount}
              onChange={(e) => setPeopleCount(e.target.value)}
              className="h-14 w-full rounded-2xl border border-white/15 bg-slate-950/38 px-4 text-base text-white outline-none backdrop-blur-sm transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20"
            />
          </div>
        </div>

        <div className="mt-7 rounded-3xl border border-emerald-400/35 bg-emerald-500/10 p-5 shadow-sm backdrop-blur-md">
          <p className="text-sm text-emerald-200">{"Selecci\u00f3n actual"}</p>
          <p className="mt-2 text-2xl font-semibold tracking-tight text-white">
            {selectedHour == null
              ? "A\u00fan no seleccionaste horario"
              : `${selectedHour}:00 \u2014 ${endHour}:00`}
          </p>
          <p className="mt-2 text-sm text-emerald-100/85">
            {selectedHour == null
              ? "Primero elige un bloque disponible en el panel de la derecha."
              : "Tu reserva se generar\u00e1 con token y QR para validaci\u00f3n."}
          </p>
        </div>

        <button
          onClick={onCreateBooking}
          disabled={creating || selectedHour == null || !courtId || !date}
          className="mt-7 inline-flex h-14 w-full cursor-pointer items-center justify-center rounded-2xl bg-emerald-500 px-5 text-base font-semibold text-white transition hover:scale-[0.99] hover:bg-emerald-600 disabled:cursor-not-allowed disabled:bg-white/10 disabled:text-white/35"
        >
          {creating
            ? "Reservando..."
            : selectedHour == null
              ? "Elige una hora para reservar"
              : `Reservar ${selectedHour}:00\u2013${endHour}:00`}
        </button>
      </div>
    </section>
  );
}
