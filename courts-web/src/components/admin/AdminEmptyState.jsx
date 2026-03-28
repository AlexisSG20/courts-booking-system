export default function AdminEmptyState() {
  return (
    <div className="rounded-[2rem] border border-dashed border-white/16 bg-slate-950/44 px-6 py-12 text-center shadow-[0_24px_80px_rgba(15,23,42,0.2)] backdrop-blur-md">
      <div className="mx-auto max-w-2xl">
        <div className="mb-4 inline-flex rounded-full border border-white/12 bg-white/6 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.28em] text-white/70">
          Sin resultados
        </div>

        <h3 className="text-2xl font-semibold tracking-tight text-white">
          No hay reservas para mostrar
        </h3>

        <p className="mt-3 text-sm leading-7 text-slate-200/74">
          Prueba otro rango de fechas, cambia la cancha seleccionada o desactiva
          el filtro de pendientes para ver mas resultados en el panel.
        </p>
      </div>
    </div>
  );
}
