export default function ValidateHero() {
  return (
    <section className="relative overflow-hidden rounded-[28px] border border-gray-200 bg-white p-6 shadow-lg md:p-8">
      <div className="relative grid gap-6 lg:grid-cols-[1.4fr_0.9fr]">
        <div>
          <div className="mb-4 flex flex-wrap gap-2">
            <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-medium tracking-[0.2em] text-emerald-700 uppercase">
              Staff access
            </span>
            <span className="rounded-full border border-violet-200 bg-violet-50 px-3 py-1 text-xs font-medium tracking-[0.2em] text-violet-700 uppercase">
              Token + QR
            </span>
            <span className="rounded-full border border-gray-200 bg-gray-50 px-3 py-1 text-xs font-medium tracking-[0.2em] text-gray-600 uppercase">
              Check-in seguro
            </span>
          </div>

          <p className="mb-3 text-xs uppercase tracking-[0.35em] text-gray-500">
            Courts Booking System
          </p>

          <h1 className="max-w-3xl text-4xl font-semibold leading-tight text-gray-900 md:text-5xl">
            Valida reservas por token o QR y registra el ingreso en segundos.
          </h1>

          <p className="mt-4 max-w-2xl text-sm leading-7 text-gray-600 md:text-base">
            Pantalla operativa para staff y administradores. Busca una reserva,
            escanea el QR desde cámara y realiza el check-in con una interfaz
            clara, rápida y pensada como producto real.
          </p>
        </div>

        <div className="grid gap-4">
          <div className="rounded-3xl border border-gray-200 bg-gray-50 p-5">
            <p className="text-sm text-gray-500">Método</p>
            <p className="mt-2 text-3xl font-semibold text-gray-900">Token o QR</p>
          </div>

          <div className="rounded-3xl border border-gray-200 bg-gray-50 p-5">
            <p className="text-sm text-gray-500">Uso</p>
            <p className="mt-2 text-3xl font-semibold text-gray-900">Check-in</p>
          </div>

          <div className="rounded-3xl border border-gray-200 bg-gray-50 p-5">
            <p className="text-sm text-gray-500">Acceso</p>
            <p className="mt-2 text-3xl font-semibold text-gray-900">Staff / Admin</p>
          </div>
        </div>
      </div>
    </section>
  );
}