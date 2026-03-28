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
    <section className="overflow-hidden rounded-[28px] border border-gray-200 bg-white shadow-lg">
      <div className="border-b border-gray-200 px-6 py-5">
        <p className="text-xs uppercase tracking-[0.32em] text-gray-500">Listado</p>
        <h2 className="mt-2 text-2xl font-semibold tracking-tight text-gray-900">
          Reservas registradas
        </h2>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-[980px] w-full">
          <thead className="bg-gray-50">
            <tr className="text-left">
              <th className="px-6 py-4 text-xs font-semibold uppercase tracking-[0.22em] text-gray-500">
                Fecha
              </th>
              <th className="px-4 py-4 text-xs font-semibold uppercase tracking-[0.22em] text-gray-500">
                Cancha
              </th>
              <th className="px-4 py-4 text-xs font-semibold uppercase tracking-[0.22em] text-gray-500">
                Horario
              </th>
              <th className="px-4 py-4 text-xs font-semibold uppercase tracking-[0.22em] text-gray-500">
                Personas
              </th>
              <th className="px-4 py-4 text-xs font-semibold uppercase tracking-[0.22em] text-gray-500">
                Total
              </th>
              <th className="px-4 py-4 text-xs font-semibold uppercase tracking-[0.22em] text-gray-500">
                Token
              </th>
              <th className="px-4 py-4 text-xs font-semibold uppercase tracking-[0.22em] text-gray-500">
                Estado
              </th>
            </tr>
          </thead>

          <tbody>
            {bookings.map((b) => {
              const used = Boolean(b.usedAt);

              return (
                <tr key={b.id} className="border-t border-gray-100 hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-700">{b.date}</td>

                  <td className="px-4 py-4 text-sm text-gray-900 font-medium">
                    {b.court?.name ?? `#${b.courtId}`}
                  </td>

                  <td className="px-4 py-4 text-sm text-gray-700">
                    {b.startHour}:00 - {b.endHour}:00
                  </td>

                  <td className="px-4 py-4 text-sm text-gray-700">{b.peopleCount}</td>

                  <td className="px-4 py-4 text-sm font-semibold text-gray-900">
                    {money(b.totalPrice)}
                  </td>

                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2">
                      <code className="max-w-[240px] truncate rounded-xl border border-gray-200 bg-gray-100 px-3 py-2 text-xs text-gray-700">
                        {b.token}
                      </code>
                      <button
                        onClick={() => copy(b.token)}
                        className="cursor-pointer rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-xs font-semibold text-gray-700 transition hover:bg-gray-100"
                      >
                        Copiar
                      </button>
                    </div>
                  </td>

                  <td className="px-4 py-4">
                    {used ? (
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm font-medium text-emerald-600">
                          <StatusDot tone="emerald" />
                          <span>Ingreso registrado</span>
                        </div>
                        <p className="text-xs text-gray-500">{formatLimaDateTime(b.usedAt)}</p>
                      </div>
                    ) : (
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => checkIn(b.token)}
                          className="cursor-pointer rounded-2xl bg-emerald-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-600"
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