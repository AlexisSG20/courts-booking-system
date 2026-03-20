export default function StaffSessionCard({
  me,
  authLoading,
  doLogout,
  goToAdmin,
  goToLogin,
}) {
  return (
    <section className="rounded-[24px] border border-white/10 bg-slate-950/70 p-6 shadow-[0_0_0_1px_rgba(255,255,255,0.03)] backdrop-blur">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
            Sesión de acceso
          </p>
          <h2 className="mt-2 text-2xl font-semibold text-white">
            Staff / Administrador
          </h2>
          <p className="mt-2 max-w-xl text-sm leading-6 text-slate-400">
            Accede con tu cuenta para validar tokens, escanear códigos QR y
            registrar el ingreso de reservas.
          </p>
        </div>

        <div className="hidden rounded-2xl border border-emerald-400/20 bg-emerald-500/10 px-3 py-2 text-xs font-medium text-emerald-300 sm:block">
          {me ? "Sesión activa" : "Acceso requerido"}
        </div>
      </div>

      {me ? (
        <div className="flex flex-col gap-4 rounded-3xl border border-white/10 bg-white/[0.03] p-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm text-slate-400">Sesión actual</p>
            <p className="mt-1 text-lg font-semibold text-white">{me.email}</p>
            <p className="mt-1 text-sm text-slate-300">
              Rol: <span className="font-semibold text-cyan-300">{me.role}</span>
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            {me.role === "ADMIN" && (
              <button
                onClick={goToAdmin}
                className="cursor-pointer rounded-2xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-white/10"
              >
                Ir a Admin
              </button>
            )}

            <button
              onClick={doLogout}
              disabled={authLoading}
              className="cursor-pointer rounded-2xl border border-white/10 bg-slate-900 px-4 py-2.5 text-sm font-medium text-slate-200 transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {authLoading ? "Saliendo..." : "Salir"}
            </button>
          </div>
        </div>
      ) : (
        <div className="rounded-3xl border border-amber-400/15 bg-amber-500/5 p-5">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm font-medium text-amber-200">
                Necesitas iniciar sesión para usar esta pantalla.
              </p>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-300">
                La validación por token y el registro de ingreso requieren una
                sesión activa de staff o administrador.
              </p>
            </div>

            <div className="flex shrink-0">
              <button
                onClick={goToLogin}
                className="cursor-pointer rounded-2xl border border-cyan-400/25 bg-cyan-500/10 px-5 py-3 text-sm font-semibold text-cyan-100 transition hover:border-cyan-300/40 hover:bg-cyan-500/15"
              >
                Ir a iniciar sesión
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}