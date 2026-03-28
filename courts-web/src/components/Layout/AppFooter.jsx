export default function AppFooter() {
  return (
    <footer className="border-t border-gray-200 bg-gray-100">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-4 px-4 py-6 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
        <div>
          <p className="text-[11px] uppercase tracking-[0.28em] text-gray-500">
            Portfolio Project
          </p>
          <p className="mt-1 text-sm font-medium text-gray-900">
            Courts Booking System
          </p>
        </div>

        <div className="text-sm text-gray-600">
          Reserva, validación por token/QR y gestión administrativa en una sola
          interfaz.
        </div>
      </div>
    </footer>
  );
}