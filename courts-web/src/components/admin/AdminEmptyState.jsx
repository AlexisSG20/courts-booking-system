export default function AdminEmptyState() {
  return (
    <div className="rounded-[28px] border border-dashed border-white/10 bg-white/[0.03] px-6 py-12 text-center shadow-[0_20px_50px_rgba(0,0,0,0.18)]">
      <div className="mx-auto max-w-2xl">
        <div className="mb-4 inline-flex rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.28em] text-slate-300">
          Sin resultados
        </div>

        <h3 className="text-2xl font-semibold tracking-tight text-white">
          No hay reservas para mostrar
        </h3>

        <p className="mt-3 text-sm leading-7 text-slate-300">
          Prueba otro rango de fechas, cambia la cancha seleccionada o desactiva el filtro de
          pendientes para ver más resultados en el panel.
        </p>
      </div>
    </div>
  );
}