import { useRef } from "react";

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
  const dateInputRef = useRef(null);

  function openDatePicker() {
    const input = dateInputRef.current;
    if (!input) return;

    if (typeof input.showPicker === "function") {
      input.showPicker();
    } else {
      input.focus();
      input.click();
    }
  }

  return (
    <section className="rounded-[2rem] border border-white/10 bg-slate-900/80 p-7 shadow-xl shadow-black/20 backdrop-blur">
      <div className="mb-7">
        <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
          Nueva reserva
        </p>
        <h2 className="mt-3 text-3xl font-semibold tracking-tight text-white">
          Elige tu cancha y horario
        </h2>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-400">
          Selecciona la cancha, la fecha y la cantidad de personas. Luego elige
          una hora disponible para generar tu reserva.
        </p>
      </div>

      <div className="grid gap-5 md:grid-cols-3">
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-300">
            Cancha
          </label>

          {loadingCourts ? (
            <div className="flex h-14 items-center rounded-2xl border border-white/10 bg-slate-950/70 px-4 text-sm text-slate-400">
              Cargando...
            </div>
          ) : (
            <select
              value={courtId}
              onChange={(e) => setCourtId(e.target.value)}
              className="h-14 w-full cursor-pointer appearance-none rounded-2xl border border-white/10 bg-slate-950/80 px-4 text-base text-white outline-none transition focus:border-cyan-400/50 focus:ring-2 focus:ring-cyan-400/10"
            >
              {courts.map((c) => (
                <option key={c.id} value={c.id}>
                  #{c.id} — {c.name}
                </option>
              ))}
            </select>
          )}
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-300">
            Fecha
          </label>

          <div className="relative">
            <input
              ref={dateInputRef}
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              onClick={openDatePicker}
              className="h-14 w-full cursor-pointer rounded-2xl border border-white/10 bg-slate-950/80 px-4 pr-14 text-base text-white outline-none transition focus:border-cyan-400/50 focus:ring-2 focus:ring-cyan-400/10"
            />

            <button
              type="button"
              onClick={openDatePicker}
              className="absolute inset-y-0 right-3 flex items-center rounded-lg px-2 text-slate-400 transition hover:text-white"
              aria-label="Abrir calendario"
            >
              📅
            </button>
          </div>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-300">
            Personas
          </label>
          <input
            type="number"
            min={1}
            value={peopleCount}
            onChange={(e) => setPeopleCount(e.target.value)}
            className="h-14 w-full rounded-2xl border border-white/10 bg-slate-950/80 px-4 text-base text-white outline-none transition focus:border-cyan-400/50 focus:ring-2 focus:ring-cyan-400/10"
          />
        </div>
      </div>

      <div className="mt-7 rounded-3xl border border-cyan-400/20 bg-gradient-to-r from-cyan-400/10 to-sky-400/5 p-5">
        <p className="text-sm text-slate-300">Selección actual</p>
        <p className="mt-2 text-2xl font-semibold tracking-tight text-white">
          {selectedHour == null
            ? "Aún no seleccionaste horario"
            : `${selectedHour}:00 — ${endHour}:00`}
        </p>
        <p className="mt-2 text-sm text-slate-400">
          {selectedHour == null
            ? "Primero elige un bloque disponible en el panel de la derecha."
            : "Tu reserva se generará con token y QR para validación."}
        </p>
      </div>

      <button
        onClick={onCreateBooking}
        disabled={creating || selectedHour == null || !courtId || !date}
        className="mt-7 inline-flex h-14 w-full cursor-pointer items-center justify-center rounded-2xl bg-white px-5 text-base font-semibold text-slate-950 transition hover:scale-[0.99] hover:opacity-95 disabled:cursor-not-allowed disabled:bg-slate-700 disabled:text-slate-400"
      >
        {creating
          ? "Reservando..."
          : selectedHour == null
          ? "Elige una hora para reservar"
          : `Reservar ${selectedHour}:00–${endHour}:00`}
      </button>
    </section>
  );
}