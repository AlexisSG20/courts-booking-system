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
    <section className="overflow-hidden rounded-xl sm:rounded-2xl lg:rounded-[2rem] border border-white/12 bg-slate-950/44 shadow-[0_24px_80px_rgba(15,23,42,0.2)] backdrop-blur-md">
      <div className="border-b border-white/10 px-4 sm:px-6 py-4 sm:py-5">
        <p className="text-xs uppercase tracking-[0.32em] text-white/52">
          Listado
        </p>
        <h2 className="mt-2 text-lg sm:text-xl lg:text-2xl font-semibold tracking-tight text-white">
          Reservas registradas
        </h2>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full w-full text-sm sm:text-base">
          <thead className="bg-white/6">
            <tr className="text-left">
              <th className="px-3 sm:px-6 py-3 sm:py-4 text-xs font-semibold uppercase tracking-[0.22em] text-white/48">
                Fecha
              </th>
              <th className="px-2 sm:px-4 py-3 sm:py-4 text-xs font-semibold uppercase tracking-[0.22em] text-white/48">
                Cancha
              </th>
              <th className="px-2 sm:px-4 py-3 sm:py-4 text-xs font-semibold uppercase tracking-[0.22em] text-white/48">
                Horario
              </th>
              <th className="px-2 sm:px-4 py-3 sm:py-4 text-xs font-semibold uppercase tracking-[0.22em] text-white/48">
                Personas
              </th>
              <th className="px-2 sm:px-4 py-3 sm:py-4 text-xs font-semibold uppercase tracking-[0.22em] text-white/48">
                Total
              </th>
              <th className="px-2 sm:px-4 py-3 sm:py-4 text-xs font-semibold uppercase tracking-[0.22em] text-white/48">
                Token
              </th>
              <th className="px-2 sm:px-4 py-3 sm:py-4 text-xs font-semibold uppercase tracking-[0.22em] text-white/48">
                Estado
              </th>
            </tr>
          </thead>

          <tbody>
            {bookings.map((b) => {
              const used = Boolean(b.usedAt);

              return (
                <tr key={b.id} className="border-t border-white/8 hover:bg-white/4">
                  <td className="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-slate-200/76">
                    {b.date}
                  </td>

                  <td className="px-2 sm:px-4 py-3 sm:py-4 text-xs sm:text-sm font-medium text-white">
                    {b.court?.name ?? `#${b.courtId}`}
                  </td>

                  <td className="px-2 sm:px-4 py-3 sm:py-4 text-xs sm:text-sm text-slate-200/76">
                    {b.startHour}:00 - {b.endHour}:00
                  </td>

                  <td className="px-2 sm:px-4 py-3 sm:py-4 text-xs sm:text-sm text-slate-200/76">
                    {b.peopleCount}
                  </td>

                  <td className="px-2 sm:px-4 py-3 sm:py-4 text-xs sm:text-sm font-semibold text-white">
                    {money(b.totalPrice)}
                  </td>

                  <td className="px-2 sm:px-4 py-3 sm:py-4">
                    <div className="flex items-center gap-1 sm:gap-2">
                      <code className="max-w-[120px] sm:max-w-[240px] truncate rounded-lg sm:rounded-xl border border-white/10 bg-white/6 px-2 sm:px-3 py-1 sm:py-2 text-xs text-slate-200/78">
                        {b.token}
                      </code>
                      <button
                        onClick={() => copy(b.token)}
                        className="cursor-pointer rounded-lg sm:rounded-xl border border-white/12 bg-white/6 px-2 sm:px-3 py-1 sm:py-2 text-xs font-semibold text-white/82 transition hover:bg-white/10 whitespace-nowrap"
                      >
                        Copiar
                      </button>
                    </div>
                  </td>

                  <td className="px-2 sm:px-4 py-3 sm:py-4">
                    {used ? (
                      <div className="space-y-1 sm:space-y-2">
                        <div className="flex items-center gap-2 text-xs sm:text-sm font-medium text-emerald-200">
                          <StatusDot tone="emerald" />
                          <span>Ingreso registrado</span>
                        </div>
                        <p className="text-xs text-white/48">
                          {formatLimaDateTime(b.usedAt)}
                        </p>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 sm:gap-3">
                        <button
                          onClick={() => checkIn(b.token)}
                          className="cursor-pointer rounded-lg sm:rounded-2xl bg-emerald-500 px-3 sm:px-4 py-1 sm:py-2 text-xs sm:text-sm font-semibold text-white transition hover:bg-emerald-400 whitespace-nowrap"
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
