export default function AdminHero() {
  return (
    <section className="relative overflow-hidden rounded-[32px] border border-gray-200 bg-white p-7 shadow-lg md:p-9">
      <div className="grid gap-6 lg:grid-cols-[1.45fr_0.85fr] lg:items-stretch">
        <div className="flex flex-col justify-between">
          <div>
            <div className="mb-4 flex flex-wrap gap-2">
              <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.28em] text-emerald-700">
                Panel admin
              </span>
              <span className="rounded-full border border-violet-200 bg-violet-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.28em] text-violet-700">
                Reservas
              </span>
              <span className="rounded-full border border-gray-200 bg-gray-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.28em] text-gray-600">
                Control operativo
              </span>
            </div>

            <p className="mb-3 text-xs uppercase tracking-[0.38em] text-gray-500">
              Courts Booking System
            </p>

            <h1 className="max-w-4xl text-4xl font-semibold leading-tight tracking-tight text-gray-900 md:text-5xl">
              Gestiona reservas, revisa métricas y registra check-in desde una sola vista.
            </h1>

            <p className="mt-5 max-w-2xl text-sm leading-7 text-gray-600 md:text-base">
              Panel administrativo para filtrar reservas, exportar resultados, revisar ingresos y
              marcar accesos de forma rápida con una interfaz más clara y consistente con el resto
              del sistema.
            </p>
          </div>
        </div>

        <div className="grid gap-4">
          <div className="rounded-[24px] border border-gray-200 bg-gray-50 p-5 shadow-sm">
            <p className="text-sm text-gray-500">Operación</p>
            <p className="mt-2 text-2xl font-semibold text-gray-900">Filtros + métricas</p>
          </div>

          <div className="rounded-[24px] border border-gray-200 bg-gray-50 p-5 shadow-sm">
            <p className="text-sm text-gray-500">Acción</p>
            <p className="mt-2 text-2xl font-semibold text-gray-900">Check-in manual</p>
          </div>

          <div className="rounded-[24px] border border-gray-200 bg-gray-50 p-5 shadow-sm">
            <p className="text-sm text-gray-500">Reporte</p>
            <p className="mt-2 text-2xl font-semibold text-gray-900">Exportación Excel</p>
          </div>
        </div>
      </div>
    </section>
  );
}