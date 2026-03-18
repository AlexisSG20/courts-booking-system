export default function BookedHours({ booked }) {
  return (
    <section className="rounded-3xl border border-white/10 bg-slate-900/80 p-6 shadow-xl shadow-black/20 backdrop-blur">
      <div className="mb-5">
        <p className="text-sm uppercase tracking-[0.22em] text-slate-400">
          Estado del día
        </p>
        <h2 className="mt-2 text-2xl font-semibold text-white">
          Horas ocupadas
        </h2>
        <p className="mt-2 text-sm leading-6 text-slate-400">
          Estos bloques ya no están disponibles para nuevas reservas.
        </p>
      </div>

      {booked.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-white/10 bg-slate-950/50 p-5 text-sm text-slate-400">
          No hay horas ocupadas.
        </div>
      ) : (
        <div className="flex flex-wrap gap-3">
          {booked.map((h) => (
            <span
              key={h}
              className="rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-sm text-slate-400"
            >
              {h}:00
            </span>
          ))}
        </div>
      )}
    </section>
  );
}