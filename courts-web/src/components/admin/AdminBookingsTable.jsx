import AdminEmptyState from "./AdminEmptyState";

function StatusDot({ tone = "amber" }) {
  const toneClasses = {
    amber: "bg-amber-400 shadow-[0_0_12px_rgba(251,191,36,0.45)]",
    emerald: "bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.45)]",
  };

  return <span className={`h-2.5 w-2.5 rounded-full ${toneClasses[tone]}`} />;
}

export default function AdminBookingsTable({
  bookings,
  copy,
  checkIn,
  money,
  formatLimaDateTime,
}) {
  if (!bookings.length) {
    return <AdminEmptyState />;
  }

  return (
    <section className="overflow-hidden rounded-[28px] border border-white/10 bg-white/[0.04] shadow-[0_20px_60px_rgba(0,0,0,0.22)] backdrop-blur-sm">
      <div className="border-b border-white/10 px-6 py-5">
        <p className="text-xs uppercase tracking-[0.32em] text-slate-400">Listado</p>
        <h2 className="mt-2 text-2xl font-semibold tracking-tight text-white">
          Reservas registradas
        </h2>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-[980px] w-full">
          <thead className="bg-white/[0.03]">
            <tr className="text-left">
              <th className="px-6 py-4 text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">
                Fecha
              </th>
              <th className="px-4 py-4 text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">
                Cancha
              </th>
              <th className="px-4 py-4 text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">
                Horario
              </th>
              <th className="px-4 py-4 text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">
                Personas
              </th>
              <th className="px-4 py-4 text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">
                Total
              </th>
              <th className="px-4 py-4 text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">
                Token
              </th>
              <th className="px-4 py-4 text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">
                Estado
              </th>
            </tr>
          </thead>

          <tbody>
            {bookings.map((b) => {
              const used = Boolean(b.usedAt);

              return (
                <tr key={b.id} className="border-t border-white/5 hover:bg-white/[0.025]">
                  <td className="px-6 py-4 text-sm text-slate-200">{b.date}</td>

                  <td className="px-4 py-4 text-sm text-white">
                    {b.court?.name ?? `#${b.courtId}`}
                  </td>

                  <td className="px-4 py-4 text-sm text-slate-200">
                    {b.startHour}:00 - {b.endHour}:00
                  </td>

                  <td className="px-4 py-4 text-sm text-slate-200">{b.peopleCount}</td>

                  <td className="px-4 py-4 text-sm font-semibold text-white">
                    {money(b.totalPrice)}
                  </td>

                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2">
                      <code className="max-w-[240px] truncate rounded-xl border border-white/10 bg-slate-950/50 px-3 py-2 text-xs text-slate-200">
                        {b.token}
                      </code>
                      <button
                        onClick={() => copy(b.token)}
                        className="cursor-pointer rounded-xl border border-white/10 bg-white/[0.05] px-3 py-2 text-xs font-semibold text-slate-200 transition hover:bg-white/[0.09]"
                      >
                        Copiar
                      </button>
                    </div>
                  </td>

                  <td className="px-4 py-4">
                    {used ? (
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm font-medium text-emerald-200">
                          <StatusDot tone="emerald" />
                          <span>Ingreso registrado</span>
                        </div>
                        <p className="text-xs text-slate-400">{formatLimaDateTime(b.usedAt)}</p>
                      </div>
                    ) : (
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => checkIn(b.token)}
                          className="cursor-pointer rounded-2xl border border-cyan-400/20 bg-cyan-500/10 px-4 py-2 text-sm font-semibold text-cyan-100 transition hover:bg-cyan-500/20"
                        >
                          Registrar ingreso
                        </button>
                        <StatusDot tone="amber" />
                      </div>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}