export default function AdminEmptyState() {
  return (
    <div className="rounded-[28px] border border-dashed border-gray-300 bg-gray-50 px-6 py-12 text-center shadow-sm">
      <div className="mx-auto max-w-2xl">
        <div className="mb-4 inline-flex rounded-full border border-gray-200 bg-white px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.28em] text-gray-600">
          Sin resultados
        </div>

        <h3 className="text-2xl font-semibold tracking-tight text-gray-900">
          No hay reservas para mostrar
        </h3>

        <p className="mt-3 text-sm leading-7 text-gray-600">
          Prueba otro rango de fechas, cambia la cancha seleccionada o desactiva el filtro de
          pendientes para ver más resultados en el panel.
        </p>
      </div>
    </div>
  );
}