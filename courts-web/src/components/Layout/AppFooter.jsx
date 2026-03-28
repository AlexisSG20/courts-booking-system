export default function AppFooter() {
  return (
    <footer className="border-t border-white/10 bg-slate-950/70">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-4 px-4 py-6 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
        <div>
          <p className="text-[11px] uppercase tracking-[0.28em] text-slate-500">
            Portfolio Project
          </p>
          <p className="mt-1 text-sm font-medium text-white">
            Courts Booking System
          </p>
        </div>

        <div className="text-sm text-slate-400">
          Reserva, validación por token/QR y gestión administrativa en una sola
          interfaz.
        </div>
      </div>
    </footer>
  );
}