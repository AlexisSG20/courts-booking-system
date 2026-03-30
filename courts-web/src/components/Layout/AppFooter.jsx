export default function AppFooter() {
  return (
    <footer className="border-t border-slate-200/12 bg-slate-950/82">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-2 sm:gap-4 px-4 py-4 sm:py-6 lg:py-8 md:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
        <div>
          <p className="text-[10px] sm:text-[11px] uppercase tracking-[0.32em] text-slate-400">
            Portfolio Project
          </p>
          <p className="mt-1 text-xs sm:text-sm font-semibold text-white">
            Lozas Deportivas
          </p>
        </div>

        <p className="max-w-2xl text-xs sm:text-sm leading-5 sm:leading-7 text-slate-300">
          {"Reserva, validaci\u00f3n por token/QR y gesti\u00f3n administrativa en una sola interfaz."}
        </p>
      </div>
    </footer>
  );
}
