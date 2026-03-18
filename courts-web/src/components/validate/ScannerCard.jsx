export default function ScannerCard({
  scanning,
  videoReady,
  videoRef,
  onVideoPlaying,
}) {
  if (!scanning) return null;

  return (
    <section className="rounded-[24px] border border-white/10 bg-slate-950/70 p-6 shadow-[0_0_0_1px_rgba(255,255,255,0.03)] backdrop-blur">
      <div className="mb-4 flex items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
            Cámara
          </p>
          <h2 className="mt-2 text-2xl font-semibold text-white">
            Escaneo en tiempo real
          </h2>
          <p className="mt-2 text-sm leading-6 text-slate-400">
            Apunta la cámara hacia el código QR para capturar el token
            automáticamente.
          </p>
        </div>

        <div className="rounded-2xl border border-cyan-400/20 bg-cyan-500/10 px-3 py-2 text-xs font-medium text-cyan-300">
          {videoReady ? "Cámara lista" : "Iniciando..."}
        </div>
      </div>

      <div className="overflow-hidden rounded-[24px] border border-white/10 bg-slate-900">
        <video
          ref={videoRef}
          className="block w-full"
          muted
          playsInline
          autoPlay
          onPlaying={onVideoPlaying}
        />
      </div>

      <div className="mt-4 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-slate-400">
        {videoReady
          ? "QR detectado: el token se completará y la validación se ejecutará automáticamente."
          : "Preparando acceso a cámara..."}
      </div>
    </section>
  );
}