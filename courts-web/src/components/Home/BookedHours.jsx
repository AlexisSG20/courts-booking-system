const bookedVisual = {
  backgroundImage:
    "linear-gradient(135deg, rgba(4, 18, 31, 0.84), rgba(8, 32, 45, 0.74) 42%, rgba(245, 158, 11, 0.16)), url('https://images.unsplash.com/photo-1517466787929-bc90951d0974?auto=format&fit=crop&w=1600&q=80')",
  backgroundSize: "cover",
  backgroundPosition: "center 42%",
};

export default function BookedHours({ booked }) {
  return (
    <section className="relative isolate overflow-hidden rounded-3xl border border-white/15 shadow-[0_24px_80px_rgba(15,23,42,0.24)]">
      <div
        className="absolute inset-0 scale-[1.02] bg-cover bg-no-repeat"
        style={bookedVisual}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950/36 via-slate-950/42 to-slate-950/52 backdrop-blur-[0.6px]" />
      <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-r from-amber-400/8 via-rose-300/6 to-transparent" />

      <div className="relative z-10 p-6">
        <div className="mb-5">
          <p className="text-sm uppercase tracking-[0.22em] text-white/60">
            {"Estado del d\u00eda"}
          </p>
          <h2 className="mt-2 text-2xl font-semibold text-white">
            Horas ocupadas
          </h2>
          <p className="mt-2 text-sm leading-6 text-slate-200/84">
            {"Estos bloques ya no est\u00e1n disponibles para nuevas reservas."}
          </p>
        </div>

        {booked.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-white/15 bg-slate-950/38 p-5 text-sm text-white/65 backdrop-blur-sm">
            No hay horas ocupadas.
          </div>
        ) : (
          <div className="flex flex-wrap gap-3">
            {booked.map((h) => (
              <span
                key={h}
                className="rounded-2xl border border-white/12 bg-slate-950/38 px-4 py-3 text-sm text-white/80 shadow-sm backdrop-blur-sm"
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
