const footballSVG = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1200 600'%3E%3Crect fill='%2310b981' width='1200' height='600'/%3E%3Cline x1='600' y1='0' x2='600' y2='600' stroke='white' stroke-width='2'/%3E%3Ccircle cx='600' cy='300' r='50' fill='none' stroke='white' stroke-width='2'/%3E%3Crect x='0' y='225' width='50' height='150' fill='none' stroke='white' stroke-width='2'/%3E%3Crect x='1150' y='225' width='50' height='150' fill='none' stroke='white' stroke-width='2'/%3E%3C/svg%3E`;

export default function BookedHours({ booked }) {
  return (
    <section
      className="relative rounded-3xl border border-emerald-200 overflow-hidden shadow-xl"
      style={{
        backgroundImage: `url('${footballSVG}')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-white/95 via-white/90 to-white/85 backdrop-blur-sm"></div>
      <div className="relative z-10 p-6">
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
      </div>
    </section>
  );
}