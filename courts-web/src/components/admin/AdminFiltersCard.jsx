import MonthPicker from "./MonthPicker";
import DatePicker from "./DatePicker";

function FilterField({ label, children }) {
  return (
    <div>
      <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.24em] text-white/50">
        {label}
      </label>
      {children}
    </div>
  );
}

export default function AdminFiltersCard({
  month,
  setMonth,
  from,
  setFrom,
  to,
  setTo,
  courtId,
  setCourtId,
  courts,
  pending,
  setPending,
  load,
  clearFilters,
  exportExcel,
  loading,
  hasBookings,
}) {
  const selectBase =
    "h-14 w-full rounded-2xl border border-white/12 bg-white/8 px-4 text-[15px] text-white outline-none transition focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-400/20";

  return (
    <section className="relative z-20 rounded-[2rem] border border-white/12 bg-slate-950/44 p-6 shadow-[0_24px_80px_rgba(15,23,42,0.2)] backdrop-blur-md">
      <div className="mb-5 flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.32em] text-white/52">
            Filtros
          </p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight text-white">
            Explora reservas y resultados
          </h2>
        </div>

        <div className="rounded-full border border-white/12 bg-white/6 px-3 py-2 text-xs font-semibold text-white/68">
          Vista administrativa
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <FilterField label="Mes">
          <MonthPicker value={month} onChange={setMonth} />
        </FilterField>

        <FilterField label="Desde">
          <DatePicker
            value={from}
            onChange={(val) => {
              setFrom(val);
              setMonth("");
            }}
            placeholder="Fecha inicio"
          />
        </FilterField>

        <FilterField label="Hasta">
          <DatePicker
            value={to}
            onChange={(val) => {
              setTo(val);
              setMonth("");
            }}
            placeholder="Fecha fin"
          />
        </FilterField>

        <FilterField label="Cancha">
          <select
            value={courtId}
            onChange={(e) => setCourtId(e.target.value)}
            className={`${selectBase} cursor-pointer`}
          >
            <option value="">Todas</option>
            {courts.map((c) => (
              <option key={c.id} value={String(c.id)}>
                {c.name}
              </option>
            ))}
          </select>
        </FilterField>
      </div>

      <div className="mt-5 flex flex-col gap-4">
        <label className="inline-flex h-14 w-fit cursor-pointer items-center gap-3 rounded-2xl border border-white/12 bg-white/6 px-4 text-sm text-white/82">
          <input
            type="checkbox"
            checked={pending}
            onChange={(e) => setPending(e.target.checked)}
            className="h-4 w-4 cursor-pointer rounded border-white/20 bg-white/10 text-emerald-500 focus:ring-emerald-500"
          />
          Solo pendientes
        </label>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={load}
            disabled={loading}
            className="h-14 cursor-pointer rounded-2xl bg-emerald-500 px-5 text-sm font-semibold text-white transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "Cargando..." : "Refrescar"}
          </button>

          <button
            onClick={clearFilters}
            disabled={loading}
            className="h-14 cursor-pointer rounded-2xl border border-white/12 bg-white/6 px-5 text-sm font-semibold text-white/82 transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Limpiar filtros
          </button>

          <button
            onClick={exportExcel}
            disabled={loading || !hasBookings}
            className="h-14 cursor-pointer rounded-2xl border border-emerald-400/26 bg-emerald-400/10 px-5 text-sm font-semibold text-emerald-100 transition hover:bg-emerald-400/16 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Exportar Excel
          </button>
        </div>
      </div>
    </section>
  );
}
