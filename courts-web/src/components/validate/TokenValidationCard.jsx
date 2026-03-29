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
    <section className="rounded-xl sm:rounded-2xl lg:rounded-[2rem] border border-white/12 bg-slate-950/44 p-4 sm:p-5 lg:p-6 shadow-[0_24px_80px_rgba(15,23,42,0.2)] backdrop-blur-md">
      <p className="text-xs uppercase tracking-[0.3em] text-white/52">
        Validacion
      </p>
      <h2 className="mt-2 text-lg sm:text-xl lg:text-2xl font-semibold text-white">Buscar reserva</h2>
      <p className="mt-2 text-xs sm:text-sm leading-5 sm:leading-6 text-slate-200/78">
        Pega el token manualmente o inicia la camara para escanear el QR de la
        reserva.
      </p>

      <div className="mt-4 sm:mt-6 flex flex-col gap-3">
        <label className="block">
          <span className="mb-2 block text-xs sm:text-sm font-medium text-white/82">
            Token de reserva
          </span>
          <input
            value={token}
            onChange={(e) => setToken(e.target.value)}
            placeholder="Pega el token (UUID) o escanea QR"
            className="w-full rounded-lg sm:rounded-2xl border border-white/12 bg-white/8 px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-base text-white outline-none transition placeholder:text-slate-300/40 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20"
          />
        </label>

        <div className="flex flex-col gap-2 sm:flex-row sm:gap-3">
          <button
            onClick={() => validate()}
            disabled={loading}
            className="cursor-pointer rounded-lg sm:rounded-2xl bg-emerald-500 px-4 sm:px-5 py-2 sm:py-3 text-xs sm:text-sm font-semibold text-white transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Validando..." : "Validar token"}
          </button>

          {!scanning ? (
            <button
              onClick={startScan}
              className="cursor-pointer rounded-lg sm:rounded-2xl border border-emerald-400/28 bg-emerald-400/10 px-4 sm:px-5 py-2 sm:py-3 text-xs sm:text-sm font-medium text-emerald-100 transition hover:bg-emerald-400/16"
            >
              Escanear QR
            </button>
          ) : (
            <button
              onClick={stopScan}
              className="cursor-pointer rounded-lg sm:rounded-2xl border border-rose-400/24 bg-rose-400/10 px-4 sm:px-5 py-2 sm:py-3 text-xs sm:text-sm font-medium text-rose-100 transition hover:bg-rose-400/16"
            >
              Detener camara
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
