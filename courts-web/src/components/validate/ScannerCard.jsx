export default function ScannerCard({
  scanning,
  videoReady,
  videoRef,
  onVideoPlaying,
}) {
  if (!scanning) return null;

  return (
    <section className="rounded-xl sm:rounded-2xl lg:rounded-[2rem] border border-white/12 bg-slate-950/44 p-4 sm:p-5 lg:p-6 shadow-[0_24px_80px_rgba(15,23,42,0.2)] backdrop-blur-md">
      <div className="mb-3 sm:mb-4 flex flex-col gap-2 sm:items-start sm:justify-between sm:gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-white/52">
            Camara
          </p>
          <h2 className="mt-2 text-lg sm:text-xl lg:text-2xl font-semibold text-white">
            Escaneo en tiempo real
          </h2>
          <p className="mt-2 text-xs sm:text-sm leading-5 sm:leading-6 text-slate-200/78">
            Apunta la camara hacia el codigo QR para capturar el token
            automaticamente.
          </p>
        </div>

        <div className="rounded-lg sm:rounded-2xl border border-emerald-400/22 bg-emerald-400/12 px-3 py-2 text-xs font-medium text-emerald-100 whitespace-nowrap">
          {videoReady ? "Camara lista" : "Iniciando..."}
        </div>
      </div>

      <div className="overflow-hidden rounded-lg sm:rounded-2xl lg:rounded-[24px] border border-white/10 bg-slate-900/90">
        <video
          ref={videoRef}
          className="block w-full"
          muted
          playsInline
          autoPlay
          onPlaying={onVideoPlaying}
        />
      </div>

      <div className="mt-3 sm:mt-4 rounded-lg sm:rounded-2xl border border-white/10 bg-white/6 px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm text-slate-200/74">
        {videoReady
          ? "QR detectado: el token se completara y la validacion se ejecutara automaticamente."
          : "Preparando acceso a camara..."}
      </div>
    </section>
  );
}
