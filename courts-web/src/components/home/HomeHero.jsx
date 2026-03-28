export default function HomeHero() {
  return (
    <section className="relative overflow-hidden rounded-3xl border border-gray-200 bg-white p-8 shadow-lg">
      <div className="relative z-10 grid gap-8 lg:grid-cols-[1.3fr_0.7fr] lg:items-end">
        <div>
          <div className="mb-4 flex flex-wrap gap-3">
            <span className="rounded-full bg-emerald-500 px-3 py-1 text-xs font-medium text-white">
              Reserva rápida
            </span>
            <span className="rounded-full bg-emerald-500 px-3 py-1 text-xs font-medium text-white">
              Token QR
            </span>
            <span className="rounded-full bg-emerald-500 px-3 py-1 text-xs font-medium text-white">
              Panel admin
            </span>
          </div>

          <p className="mb-3 text-sm uppercase tracking-[0.25em] text-gray-500">
            Courts Booking System
          </p>

          <h1 className="max-w-3xl text-4xl font-bold tracking-tight text-gray-900 md:text-5xl">
            Reserva tu cancha en segundos, valida con QR y gestiona todo en un solo sistema.
          </h1>

          <p className="mt-4 max-w-2xl text-base leading-7 text-gray-600 md:text-lg">
            Una experiencia moderna para reservas deportivas, con disponibilidad clara,
            confirmación inmediata y una interfaz pensada para sentirse como producto real.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
            <p className="text-sm text-emerald-700">Disponibilidad</p>
            <p className="mt-2 text-2xl font-semibold text-emerald-900">En tiempo real</p>
          </div>

          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
            <p className="text-sm text-emerald-700">Acceso</p>
            <p className="mt-2 text-2xl font-semibold text-emerald-900">Token + QR</p>
          </div>

          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
            <p className="text-sm text-emerald-700">Gestión</p>
            <p className="mt-2 text-2xl font-semibold text-emerald-900">Vista admin</p>
          </div>
        </div>
      </div>
    </section>
  );
}