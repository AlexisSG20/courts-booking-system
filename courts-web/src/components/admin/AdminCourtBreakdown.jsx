export default function AdminCourtBreakdown({
  showBreakdown,
  byCourtList,
  summary,
  money,
  setCourtId,
}) {
  if (!showBreakdown || byCourtList.length < 1) return null;

  return (
    <section className="rounded-[28px] border border-gray-200 bg-white p-6 shadow-lg">
      <div className="mb-5">
        <p className="text-xs uppercase tracking-[0.32em] text-gray-500">Distribución</p>
        <h2 className="mt-2 text-2xl font-semibold tracking-tight text-gray-900">Resumen por cancha</h2>
      </div>

      <div className="grid gap-4">
        {byCourtList.map((c) => {
          const pct = summary.revenue > 0 ? Math.round((c.revenue / summary.revenue) * 100) : 0;

          return (
            <div
              key={String(c.courtId)}
              className="rounded-[24px] border border-gray-200 bg-gray-50 p-5"
            >
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-lg font-semibold text-gray-900">{c.name}</h3>
                    <span className="rounded-full bg-emerald-500 px-2.5 py-1 text-[11px] font-semibold text-white">
                      {pct}% del ingreso
                    </span>
                  </div>

                  <p className="mt-2 text-sm text-gray-600">
                    {c.total} total · {c.pending} pendientes · {c.used} usadas · {c.people} personas
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <div className="text-xl font-semibold text-gray-900">{money(c.revenue)}</div>
                  <button
                    onClick={() => setCourtId(String(c.courtId))}
                    className="cursor-pointer rounded-2xl border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-100"
                    >
                    Filtrar
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}