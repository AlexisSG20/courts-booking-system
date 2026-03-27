import { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { login, getAccessToken } from "../lib/auth";

function getRedirectByRole(role) {
  return role === "ADMIN" ? "/admin/bookings" : "/validate";
}

export default function Login({ onAuthChange, me }) {
  const navigate = useNavigate();

  const [email, setEmail] = useState("admin@courts.com");
  const [password, setPassword] = useState("Admin123*");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setError("");
  }, [email, password]);

  if (getAccessToken() && me?.role) {
    return <Navigate to={getRedirectByRole(me.role)} replace />;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      const data = await login(email, password);

      await onAuthChange?.();

      const role = data?.user?.role;
      navigate(getRedirectByRole(role), { replace: true });
    } catch (err) {
      setError(err?.message || "No se pudo iniciar sesión.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="bg-[radial-gradient(circle_at_top,_rgba(18,56,110,0.35),_transparent_28%),linear-gradient(180deg,_#020617_0%,_#020817_48%,_#01030d_100%)] text-white">
      <section className="mx-auto flex w-full max-w-7xl items-center px-6 py-10 sm:px-8 lg:px-10">
        <div className="grid w-full gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-[32px] border border-cyan-400/15 bg-[linear-gradient(135deg,rgba(6,78,110,0.18),rgba(15,23,42,0.86)_42%,rgba(30,41,59,0.72)_100%)] p-7 shadow-[0_20px_70px_rgba(0,0,0,0.35)] sm:p-10">
            <div className="mb-6 flex flex-wrap gap-3">
              <span className="rounded-full border border-cyan-400/30 bg-cyan-500/10 px-4 py-1 text-[11px] uppercase tracking-[0.28em] text-cyan-200">
                acceso seguro
              </span>
              <span className="rounded-full border border-violet-400/25 bg-violet-500/10 px-4 py-1 text-[11px] uppercase tracking-[0.28em] text-violet-200">
                admin + staff
              </span>
              <span className="rounded-full border border-white/10 bg-white/5 px-4 py-1 text-[11px] uppercase tracking-[0.28em] text-slate-300">
                courts booking system
              </span>
            </div>

            <p className="mb-3 text-[12px] uppercase tracking-[0.42em] text-slate-400">
              portfolio project
            </p>

            <h1 className="max-w-3xl text-4xl font-semibold leading-tight text-white sm:text-5xl">
              Inicia sesión y entra al flujo correcto según tu rol.
            </h1>

            <p className="mt-6 max-w-2xl text-base leading-8 text-slate-300 sm:text-lg">
              Usa una sola pantalla para autenticarte. El sistema detecta si eres
              <span className="font-medium text-cyan-200"> staff </span>
              o
              <span className="font-medium text-violet-200"> administrador </span>
              y te redirige a la vista adecuada usando el auth actual del proyecto.
            </p>

            <div className="mt-10 grid gap-4 sm:grid-cols-3">
              <article className="rounded-3xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur">
                <p className="text-sm text-slate-400">Acceso</p>
                <p className="mt-3 text-2xl font-semibold text-white">JWT</p>
              </article>

              <article className="rounded-3xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur">
                <p className="text-sm text-slate-400">Redirección</p>
                <p className="mt-3 text-2xl font-semibold text-white">Por rol</p>
              </article>

              <article className="rounded-3xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur">
                <p className="text-sm text-slate-400">Sesión</p>
                <p className="mt-3 text-2xl font-semibold text-white">Actual</p>
              </article>
            </div>
          </div>

          <div className="rounded-[32px] border border-white/10 bg-white/[0.035] p-6 shadow-[0_20px_70px_rgba(0,0,0,0.35)] backdrop-blur sm:p-8">
            <div className="mb-6 flex items-start justify-between gap-4">
              <div>
                <p className="text-[12px] uppercase tracking-[0.35em] text-slate-400">
                  iniciar sesión
                </p>
                <h2 className="mt-3 text-3xl font-semibold text-white">
                  Acceso al sistema
                </h2>
                <p className="mt-3 max-w-md text-sm leading-7 text-slate-300">
                  Ingresa con tu cuenta actual. Si eres staff irás a validación; si
                  eres admin irás al panel administrativo.
                </p>
              </div>

              <span className="rounded-2xl border border-emerald-400/20 bg-emerald-500/10 px-4 py-2 text-sm text-emerald-200">
                Auth real
              </span>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-medium text-slate-200"
                >
                  Correo
                </label>
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@courts.com"
                  className="h-14 w-full rounded-2xl border border-white/10 bg-slate-950/80 px-4 text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-400/50 focus:ring-2 focus:ring-cyan-400/20"
                />
              </div>

              <div>
                <div className="mb-2 flex items-center justify-between gap-3">
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-slate-200"
                  >
                    Contraseña
                  </label>

                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="cursor-pointer text-sm text-cyan-200 transition hover:text-cyan-100"
                  >
                    {showPassword ? "Ocultar" : "Mostrar"}
                  </button>
                </div>

                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Tu contraseña"
                  className="h-14 w-full rounded-2xl border border-white/10 bg-slate-950/80 px-4 text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-400/50 focus:ring-2 focus:ring-cyan-400/20"
                />
              </div>

              {error ? (
                <div className="rounded-2xl border border-rose-400/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
                  {error}
                </div>
              ) : null}

              <button
                type="submit"
                disabled={submitting}
                className="flex h-14 w-full cursor-pointer items-center justify-center rounded-2xl border border-cyan-400/25 bg-[linear-gradient(135deg,rgba(6,182,212,0.18),rgba(14,165,233,0.08))] px-5 text-base font-medium text-white transition hover:border-cyan-300/40 hover:bg-cyan-500/10 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submitting ? "Ingresando..." : "Iniciar sesión"}
              </button>
            </form>

            <div className="mt-6 rounded-3xl border border-white/10 bg-slate-950/40 p-5">
              <p className="text-[12px] uppercase tracking-[0.3em] text-slate-400">
                flujo esperado
              </p>

              <div className="mt-4 space-y-3 text-sm text-slate-300">
                <div className="flex items-center justify-between rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-3">
                  <span>Cuenta STAFF</span>
                  <span className="text-cyan-200">/validate</span>
                </div>

                <div className="flex items-center justify-between rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-3">
                  <span>Cuenta ADMIN</span>
                  <span className="text-violet-200">/admin/bookings</span>
                </div>
              </div>
            </div>

            <p className="mt-5 text-xs leading-6 text-slate-500">
              Esta pantalla reutiliza el backend actual, el access token y el
              refresh token ya existentes en tu proyecto.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}