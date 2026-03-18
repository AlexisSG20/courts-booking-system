export default function ValidateEmptyState({ scanning, booking }) {
  if (scanning || booking) return null;

  return (
    <section className="rounded-[24px] border border-white/10 bg-slate-950/70 p-6 shadow-[0_0_0_1px_rgba(255,255,255,0.03)] backdrop-blur">
      <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
        Estado
      </p>
      <h2 className="mt-2 text-2xl font-semibold text-white">
        Listo para validar
      </h2>
      <p className="mt-2 text-sm leading-6 text-slate-400">
        Inicia un escaneo QR o valida un token manualmente. Aquí aparecerá la
        cámara o el detalle de la reserva encontrada.
      </p>

      <div className="mt-6 grid gap-4">
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
          <p className="text-sm font-medium text-white">Escaneo QR</p>
          <p className="mt-1 text-sm text-slate-400">
            Activa la cámara para capturar el token automáticamente.
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
          <p className="text-sm font-medium text-white">Validación manual</p>
          <p className="mt-1 text-sm text-slate-400">
            Pega el UUID de la reserva y consulta su estado.
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
          <p className="text-sm font-medium text-white">Resultado</p>
          <p className="mt-1 text-sm text-slate-400">
            Verás si la reserva está válida, usada o lista para check-in.
          </p>
        </div>
      </div>
    </section>
  );
}