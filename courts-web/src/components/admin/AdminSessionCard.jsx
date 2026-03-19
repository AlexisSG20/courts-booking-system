export default function AdminSessionCard({
  email,
  password,
  setEmail,
  setPassword,
  doLogin,
  doLogout,
  authLoading,
  accessToken,
}) {
  return (
    <section className="rounded-[28px] border border-white/10 bg-white/[0.04] p-6 shadow-[0_20px_60px_rgba(0,0,0,0.22)] backdrop-blur-sm">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.32em] text-slate-400">Sesión admin</p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight text-white">
            Estado de acceso
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-300">
            Revisa la sesión actual del panel y ciérrala cuando lo necesites.
          </p>
        </div>

        <div
          className={`shrink-0 rounded-full border px-3 py-2 text-xs font-semibold ${
            accessToken
              ? "border-emerald-400/30 bg-emerald-500/10 text-emerald-200"
              : "border-white/10 bg-white/[0.04] text-slate-300"
          }`}
        >
          {accessToken ? "Sesión activa" : "Sin sesión"}
        </div>
      </div>

      {accessToken ? (
        <div className="flex flex-col gap-4 rounded-[24px] border border-white/10 bg-slate-950/40 p-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Acceso actual</p>
            <p className="mt-2 text-xl font-semibold text-white">{email || "admin@courts.com"}</p>
            <p className="mt-1 text-sm text-slate-300">
              Ya existe una sesión válida para usar el panel.
            </p>
          </div>

          <button
            onClick={doLogout}
            className="h-12 cursor-pointer rounded-2xl border border-white/10 bg-white/[0.05] px-5 text-sm font-semibold text-slate-200 transition hover:bg-white/[0.09]"
          >
            Cerrar sesión
          </button>
        </div>
      ) : (
        <div className="grid gap-4 xl:grid-cols-[1fr_1fr_auto] xl:items-end">
          <div>
            <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">
              Email
            </label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@courts.com"
              className="h-14 w-full rounded-2xl border border-white/10 bg-slate-950/60 px-4 text-sm text-white outline-none transition focus:border-cyan-400/40 focus:outline-none focus:ring-0"
            />
          </div>

          <div>
            <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">
              Contraseña
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="********"
              className="h-14 w-full rounded-2xl border border-white/10 bg-slate-950/60 px-4 text-sm text-white outline-none transition focus:border-cyan-400/40 focus:outline-none focus:ring-0"
            />
          </div>

          <button
            onClick={doLogin}
            disabled={authLoading || !email || !password}
            className="h-14 cursor-pointer rounded-2xl border border-cyan-400/20 bg-cyan-500/10 px-6 text-sm font-semibold text-cyan-100 transition hover:bg-cyan-500/20 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {authLoading ? "Entrando..." : "Iniciar sesión"}
          </button>
        </div>
      )}
    </section>
  );
}