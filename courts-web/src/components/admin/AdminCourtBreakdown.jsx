export default function AdminCourtBreakdown({
  showBreakdown,
  byCourtList,
  summary,
  money,
  setCourtId,
}) {
  if (!showBreakdown || byCourtList.length < 1) return null;

  return (
    <section className="rounded-[2rem] border border-white/12 bg-slate-950/44 p-6 shadow-[0_24px_80px_rgba(15,23,42,0.2)] backdrop-blur-md">
      <div className="mb-5">
        <p className="text-xs uppercase tracking-[0.32em] text-white/52">
          Distribucion
        </p>
        <h2 className="mt-2 text-2xl font-semibold tracking-tight text-white">
          Resumen por cancha
        </h2>
      </div>

      <div className="grid gap-4">
        {byCourtList.map((c) => {
          const pct =
            summary.revenue > 0
              ? Math.round((c.revenue / summary.revenue) * 100)
              : 0;

          return (
            <div
              key={String(c.courtId)}
              className="rounded-[24px] border border-white/10 bg-white/6 p-5"
            >
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-lg font-semibold text-white">{c.name}</h3>
                    <span className="rounded-full border border-emerald-400/24 bg-emerald-400/10 px-2.5 py-1 text-[11px] font-semibold text-emerald-100">
                      {pct}% del ingreso
                    </span>
                  </div>

                  <p className="mt-2 text-sm text-slate-200/72">
                    {c.total} total · {c.pending} pendientes · {c.used} usadas ·{" "}
                    {c.people} personas
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <div className="text-xl font-semibold text-white">
                    {money(c.revenue)}
                  </div>
                  <button
                    onClick={() => setCourtId(String(c.courtId))}
                    className="cursor-pointer rounded-2xl border border-white/12 bg-white/6 px-4 py-2 text-sm font-semibold text-white/84 transition hover:bg-white/10"
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
