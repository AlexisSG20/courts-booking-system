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
    <main className="min-h-[calc(100vh-81px)] bg-transparent text-gray-900">
      <section className="mx-auto flex w-full max-w-7xl items-center px-6 py-10 sm:px-8 lg:px-10">
        <div className="grid w-full gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-[32px] border border-gray-200 bg-white p-7 shadow-lg sm:p-10">
            <div className="mb-6 flex flex-wrap gap-3">
              <span className="rounded-full border border-emerald-200 bg-emerald-50 px-4 py-1 text-[11px] uppercase tracking-[0.28em] text-emerald-700">
                acceso seguro
              </span>
              <span className="rounded-full border border-violet-200 bg-violet-50 px-4 py-1 text-[11px] uppercase tracking-[0.28em] text-violet-700">
                admin + staff
              </span>
              <span className="rounded-full border border-gray-200 bg-gray-50 px-4 py-1 text-[11px] uppercase tracking-[0.28em] text-gray-600">
                courts booking system
              </span>
            </div>

            <p className="mb-3 text-[12px] uppercase tracking-[0.42em] text-gray-500">
              portfolio project
            </p>

            <h1 className="max-w-3xl text-4xl font-semibold leading-tight text-gray-900 sm:text-5xl">
              Inicia sesión y entra al flujo correcto según tu rol.
            </h1>

            <p className="mt-6 max-w-2xl text-base leading-8 text-gray-600 sm:text-lg">
              Usa una sola pantalla para autenticarte. El sistema detecta si eres
              <span className="font-medium text-emerald-600"> staff </span>
              o
              <span className="font-medium text-violet-600"> administrador </span>
              y te redirige a la vista adecuada usando el auth actual del proyecto.
            </p>

            <div className="mt-10 grid gap-4 sm:grid-cols-3">
              <article className="rounded-3xl border border-gray-200 bg-gray-50 p-5">
                <p className="text-sm text-gray-500">Acceso</p>
                <p className="mt-3 text-2xl font-semibold text-gray-900">JWT</p>
              </article>

              <article className="rounded-3xl border border-gray-200 bg-gray-50 p-5">
                <p className="text-sm text-gray-500">Redirección</p>
                <p className="mt-3 text-2xl font-semibold text-gray-900">Por rol</p>
              </article>

              <article className="rounded-3xl border border-gray-200 bg-gray-50 p-5">
                <p className="text-sm text-gray-500">Sesión</p>
                <p className="mt-3 text-2xl font-semibold text-gray-900">Actual</p>
              </article>
            </div>
          </div>

          <div className="rounded-[32px] border border-gray-200 bg-white p-6 shadow-lg sm:p-8">
            <div className="mb-6 flex items-start justify-between gap-4">
              <div>
                <p className="text-[12px] uppercase tracking-[0.35em] text-gray-500">
                  iniciar sesión
                </p>
                <h2 className="mt-3 text-3xl font-semibold text-gray-900">
                  Acceso al sistema
                </h2>
                <p className="mt-3 max-w-md text-sm leading-7 text-gray-600">
                  Ingresa con tu cuenta actual. Si eres staff irás a validación; si
                  eres admin irás al panel administrativo.
                </p>
              </div>

              <span className="rounded-2xl bg-emerald-500 px-4 py-2 text-sm font-medium text-white">
                Auth real
              </span>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-medium text-gray-700"
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
                  className="h-14 w-full rounded-2xl border border-gray-200 bg-white px-4 text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                />
              </div>

              <div>
                <div className="mb-2 flex items-center justify-between gap-3">
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Contraseña
                  </label>

                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="cursor-pointer text-sm text-emerald-600 transition hover:text-emerald-700"
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
                  className="h-14 w-full rounded-2xl border border-gray-200 bg-white px-4 text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                />
              </div>

              {error ? (
                <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-600">
                  {error}
                </div>
              ) : null}

              <button
                type="submit"
                disabled={submitting}
                className="flex h-14 w-full cursor-pointer items-center justify-center rounded-2xl bg-emerald-500 px-5 text-base font-medium text-white transition hover:bg-emerald-600 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submitting ? "Ingresando..." : "Iniciar sesión"}
              </button>
            </form>

            <div className="mt-6 rounded-3xl border border-gray-200 bg-gray-50 p-5">
              <p className="text-[12px] uppercase tracking-[0.3em] text-gray-500">
                flujo esperado
              </p>

              <div className="mt-4 space-y-3 text-sm text-gray-600">
                <div className="flex items-center justify-between rounded-2xl border border-gray-200 bg-white px-4 py-3">
                  <span>Cuenta STAFF</span>
                  <span className="text-emerald-600">/validate</span>
                </div>

                <div className="flex items-center justify-between rounded-2xl border border-gray-200 bg-white px-4 py-3">
                  <span>Cuenta ADMIN</span>
                  <span className="text-violet-600">/admin/bookings</span>
                </div>
              </div>
            </div>

            <p className="mt-5 text-xs leading-6 text-gray-500">
              Esta pantalla reutiliza el backend actual, el access token y el
              refresh token ya existentes en tu proyecto.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}