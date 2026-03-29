export default function ScannerCard({
  scanning,
  videoReady,
  videoRef,
  onVideoPlaying,
}) {
  if (!scanning) return null;

  return (
    <section className="rounded-[2rem] border border-white/12 bg-slate-950/44 p-6 shadow-[0_24px_80px_rgba(15,23,42,0.2)] backdrop-blur-md">
      <div className="mb-4 flex items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-white/52">
            Camara
          </p>
          <h2 className="mt-2 text-2xl font-semibold text-white">
            Escaneo en tiempo real
          </h2>
          <p className="mt-2 text-sm leading-6 text-slate-200/78">
            Apunta la camara hacia el codigo QR para capturar el token
            automaticamente.
          </p>
        </div>

        <div className="rounded-2xl border border-emerald-400/22 bg-emerald-400/12 px-3 py-2 text-xs font-medium text-emerald-100">
          {videoReady ? "Camara lista" : "Iniciando..."}
        </div>
      </div>

      <div className="overflow-hidden rounded-[24px] border border-white/10 bg-slate-900/90">
        <video
          ref={videoRef}
          className="block w-full"
          muted
          playsInline
          autoPlay
          onPlaying={onVideoPlaying}
        />
      </div>

      <div className="mt-4 rounded-2xl border border-white/10 bg-white/6 px-4 py-3 text-sm text-slate-200/74">
        {videoReady
          ? "QR detectado: el token se completara y la validacion se ejecutara automaticamente."
          : "Preparando acceso a camara..."}
      </div>
    </section>
  );
}
