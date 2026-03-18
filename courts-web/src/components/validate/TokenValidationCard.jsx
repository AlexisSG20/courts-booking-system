export default function TokenValidationCard({
  token,
  setToken,
  loading,
  scanning,
  validate,
  startScan,
  stopScan,
}) {
  return (
    <section className="rounded-[24px] border border-white/10 bg-slate-950/70 p-6 shadow-[0_0_0_1px_rgba(255,255,255,0.03)] backdrop-blur">
      <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
        Validación
      </p>
      <h2 className="mt-2 text-2xl font-semibold text-white">
        Buscar reserva
      </h2>
      <p className="mt-2 text-sm leading-6 text-slate-400">
        Pega el token manualmente o inicia la cámara para escanear el QR de la
        reserva.
      </p>

      <div className="mt-6 flex flex-col gap-3">
        <label className="block">
          <span className="mb-2 block text-sm font-medium text-slate-300">
            Token de reserva
          </span>
          <input
            value={token}
            onChange={(e) => setToken(e.target.value)}
            placeholder="Pega el token (UUID) o escanea QR"
            className="w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-400/50 focus:ring-2 focus:ring-cyan-500/20"
          />
        </label>

        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => validate()}
            disabled={loading}
            className="cursor-pointer rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-slate-950 transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Validando..." : "Validar token"}
          </button>

          {!scanning ? (
            <button
              onClick={startScan}
              className="cursor-pointer rounded-2xl border border-cyan-400/20 bg-cyan-500/10 px-5 py-3 text-sm font-medium text-cyan-300 transition hover:bg-cyan-500/15"
            >
              📷 Escanear QR
            </button>
          ) : (
            <button
              onClick={stopScan}
              className="cursor-pointer rounded-2xl border border-rose-400/20 bg-rose-500/10 px-5 py-3 text-sm font-medium text-rose-300 transition hover:bg-rose-500/15"
            >
              ✋ Detener cámara
            </button>
          )}
        </div>
      </div>
    </section>
  );
}