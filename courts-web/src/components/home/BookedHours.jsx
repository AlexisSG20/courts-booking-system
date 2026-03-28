export default function BookedHours({ booked }) {
  return (
    <section className="rounded-3xl border border-gray-200 bg-white p-6 shadow-lg">
      <div className="mb-5">
        <p className="text-sm uppercase tracking-[0.22em] text-gray-500">
          Estado del día
        </p>
        <h2 className="mt-2 text-2xl font-semibold text-gray-900">
          Horas ocupadas
        </h2>
        <p className="mt-2 text-sm leading-6 text-gray-600">
          Estos bloques ya no están disponibles para nuevas reservas.
        </p>
      </div>

      {booked.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50 p-5 text-sm text-gray-500">
          No hay horas ocupadas.
        </div>
      ) : (
        <div className="flex flex-wrap gap-3">
          {booked.map((h) => (
            <span
              key={h}
              className="rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-600"
            >
              {h}:00
            </span>
          ))}
        </div>
      )}
    </section>
  );
}