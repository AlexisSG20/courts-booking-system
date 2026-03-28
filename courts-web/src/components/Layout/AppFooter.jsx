export default function AppFooter() {
  return (
    <footer className="border-t border-slate-200/12 bg-slate-950/82">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-4 px-4 py-8 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
        <div>
          <p className="text-[11px] uppercase tracking-[0.32em] text-slate-400">
            Portfolio Project
          </p>
          <p className="mt-1 text-sm font-semibold text-white">
            Courts Booking System
          </p>
        </div>

        <p className="max-w-2xl text-sm leading-7 text-slate-300">
          {"Reserva, validaci\u00f3n por token/QR y gesti\u00f3n administrativa en una sola interfaz."}
        </p>
      </div>
    </footer>
  );
}
