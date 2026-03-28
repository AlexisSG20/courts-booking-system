export default function ScannerCard({
  scanning,
  videoReady,
  videoRef,
  onVideoPlaying,
}) {
  if (!scanning) return null;

  return (
    <section className="rounded-[24px] border border-gray-200 bg-white p-6 shadow-lg">
      <div className="mb-4 flex items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-gray-500">
            Cámara
          </p>
          <h2 className="mt-2 text-2xl font-semibold text-gray-900">
            Escaneo en tiempo real
          </h2>
          <p className="mt-2 text-sm leading-6 text-gray-600">
            Apunta la cámara hacia el código QR para capturar el token
            automáticamente.
          </p>
        </div>

        <div className="rounded-2xl bg-emerald-500 px-3 py-2 text-xs font-medium text-white">
          {videoReady ? "Cámara lista" : "Iniciando..."}
        </div>
      </div>

      <div className="overflow-hidden rounded-[24px] border border-gray-200 bg-gray-100">
        <video
          ref={videoRef}
          className="block w-full"
          muted
          playsInline
          autoPlay
          onPlaying={onVideoPlaying}
        />
      </div>

      <div className="mt-4 rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-600">
        {videoReady
          ? "QR detectado: el token se completará y la validación se ejecutará automáticamente."
          : "Preparando acceso a cámara..."}
      </div>
    </section>
  );
}