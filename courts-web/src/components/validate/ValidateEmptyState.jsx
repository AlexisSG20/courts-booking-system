export default function ValidateEmptyState({ scanning, booking }) {
  if (scanning || booking) return null;

  return (
    <section className="rounded-[24px] border border-gray-200 bg-white p-6 shadow-lg">
      <p className="text-xs uppercase tracking-[0.3em] text-gray-500">
        Estado
      </p>
      <h2 className="mt-2 text-2xl font-semibold text-gray-900">
        Listo para validar
      </h2>
      <p className="mt-2 text-sm leading-6 text-gray-600">
        Inicia un escaneo QR o valida un token manualmente. Aquí aparecerá la
        cámara o el detalle de la reserva encontrada.
      </p>

      <div className="mt-6 grid gap-4">
        <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4">
          <p className="text-sm font-medium text-gray-900">Escaneo QR</p>
          <p className="mt-1 text-sm text-gray-600">
            Activa la cámara para capturar el token automáticamente.
          </p>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4">
          <p className="text-sm font-medium text-gray-900">Validación manual</p>
          <p className="mt-1 text-sm text-gray-600">
            Pega el UUID de la reserva y consulta su estado.
          </p>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4">
          <p className="text-sm font-medium text-gray-900">Resultado</p>
          <p className="mt-1 text-sm text-gray-600">
            Verás si la reserva está válida, usada o lista para check-in.
          </p>
        </div>
      </div>
    </section>
  );
}