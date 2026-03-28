import DatePicker from "../admin/DatePicker";

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
    <section className="relative z-20 rounded-[2rem] border border-gray-200 bg-white p-7 shadow-lg">
      <div className="mb-7">
        <p className="text-xs uppercase tracking-[0.3em] text-gray-500">
          Nueva reserva
        </p>
        <h2 className="mt-3 text-3xl font-semibold tracking-tight text-gray-900">
          Elige tu cancha y horario
        </h2>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-gray-600">
          Selecciona la cancha, la fecha y la cantidad de personas. Luego elige
          una hora disponible para generar tu reserva.
        </p>
      </div>

      <div className="grid gap-5 md:grid-cols-3">
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Cancha
          </label>

          {loadingCourts ? (
            <div className="flex h-14 items-center rounded-2xl border border-gray-200 bg-gray-50 px-4 text-sm text-gray-500">
              Cargando...
            </div>
          ) : (
            <select
              value={courtId}
              onChange={(e) => setCourtId(e.target.value)}
              className="h-14 w-full cursor-pointer appearance-none rounded-2xl border border-gray-300 bg-white px-4 text-base text-gray-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
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
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Fecha
          </label>
          <DatePicker
            value={date}
            onChange={setDate}
            placeholder="Seleccionar fecha"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Personas
          </label>
          <input
            type="number"
            min={1}
            value={peopleCount}
            onChange={(e) => setPeopleCount(e.target.value)}
            className="h-14 w-full rounded-2xl border border-gray-300 bg-white px-4 text-base text-gray-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
          />
        </div>
      </div>

      <div className="mt-7 rounded-3xl border border-emerald-300 bg-emerald-50 p-5">
        <p className="text-sm text-emerald-700">Selección actual</p>
        <p className="mt-2 text-2xl font-semibold tracking-tight text-emerald-900">
          {selectedHour == null
            ? "Aún no seleccionaste horario"
            : `${selectedHour}:00 — ${endHour}:00`}
        </p>
        <p className="mt-2 text-sm text-emerald-700">
          {selectedHour == null
            ? "Primero elige un bloque disponible en el panel de la derecha."
            : "Tu reserva se generará con token y QR para validación."}
        </p>
      </div>

      <button
        onClick={onCreateBooking}
        disabled={creating || selectedHour == null || !courtId || !date}
        className="mt-7 inline-flex h-14 w-full cursor-pointer items-center justify-center rounded-2xl bg-emerald-500 px-5 text-base font-semibold text-white transition hover:bg-emerald-600 hover:scale-[0.99] disabled:cursor-not-allowed disabled:bg-gray-200 disabled:text-gray-400"
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