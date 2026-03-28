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
    <section className="rounded-[24px] border border-gray-200 bg-white p-6 shadow-lg">
      <p className="text-xs uppercase tracking-[0.3em] text-gray-500">
        Validación
      </p>
      <h2 className="mt-2 text-2xl font-semibold text-gray-900">
        Buscar reserva
      </h2>
      <p className="mt-2 text-sm leading-6 text-gray-600">
        Pega el token manualmente o inicia la cámara para escanear el QR de la
        reserva.
      </p>

      <div className="mt-6 flex flex-col gap-3">
        <label className="block">
          <span className="mb-2 block text-sm font-medium text-gray-700">
            Token de reserva
          </span>
          <input
            value={token}
            onChange={(e) => setToken(e.target.value)}
            placeholder="Pega el token (UUID) o escanea QR"
            className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
          />
        </label>

        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => validate()}
            disabled={loading}
            className="cursor-pointer rounded-2xl bg-emerald-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-600 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Validando..." : "Validar token"}
          </button>

          {!scanning ? (
            <button
              onClick={startScan}
              className="cursor-pointer rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-3 text-sm font-medium text-emerald-700 transition hover:bg-emerald-100"
            >
              📷 Escanear QR
            </button>
          ) : (
            <button
              onClick={stopScan}
              className="cursor-pointer rounded-2xl border border-rose-200 bg-rose-50 px-5 py-3 text-sm font-medium text-rose-600 transition hover:bg-rose-100"
            >
              ✋ Detener cámara
            </button>
          )}
        </div>
      </div>
    </section>
  );
}