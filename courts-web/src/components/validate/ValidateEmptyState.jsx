export default function ValidateEmptyState({ scanning, booking }) {
  if (scanning || booking) return null;

  return (
    <section className="rounded-[2rem] border border-white/12 bg-slate-950/44 p-6 shadow-[0_24px_80px_rgba(15,23,42,0.2)] backdrop-blur-md">
      <p className="text-xs uppercase tracking-[0.3em] text-white/52">Estado</p>
      <h2 className="mt-2 text-2xl font-semibold text-white">
        Listo para validar
      </h2>
      <p className="mt-2 text-sm leading-6 text-slate-200/78">
        Inicia un escaneo QR o valida un token manualmente. Aqui aparecera la
        camara o el detalle de la reserva encontrada.
      </p>

      <div className="mt-6 grid gap-4">
        <div className="rounded-2xl border border-white/10 bg-white/6 p-4">
          <p className="text-sm font-medium text-white">Escaneo QR</p>
          <p className="mt-1 text-sm text-slate-200/72">
            Activa la camara para capturar el token automaticamente.
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/6 p-4">
          <p className="text-sm font-medium text-white">Validacion manual</p>
          <p className="mt-1 text-sm text-slate-200/72">
            Pega el UUID de la reserva y consulta su estado.
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/6 p-4">
          <p className="text-sm font-medium text-white">Resultado</p>
          <p className="mt-1 text-sm text-slate-200/72">
            Veras si la reserva esta valida, usada o lista para check-in.
          </p>
        </div>
      </div>
    </section>
  );
}
