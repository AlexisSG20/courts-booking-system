import { Link } from "react-router-dom";
import SessionPill from "./SessionPill";

function NavLinkItem({ to, children, isActive }) {
  return (
    <Link
      to={to}
      className={[
        "inline-flex h-11 items-center justify-center rounded-full border px-5 text-sm font-medium transition-all duration-200",
        isActive
          ? "border-emerald-500 bg-emerald-500 text-white shadow-[0_10px_30px_rgba(16,185,129,0.28)] hover:border-emerald-600 hover:bg-emerald-600"
          : "border-transparent text-slate-700 hover:border-emerald-100 hover:bg-emerald-50/80 hover:text-emerald-700",
      ].join(" ")}
    >
      {children}
    </Link>
  );
}

export default function AppHeader({ me, pathname, authLoading, onLogout }) {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/90 backdrop-blur-xl">
      <div className="mx-auto w-full max-w-7xl px-4 py-5 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 xl:grid xl:grid-cols-[220px_minmax(0,1fr)_auto] xl:items-center">
          <div className="min-w-0">
            <p className="text-[11px] uppercase tracking-[0.32em] text-slate-500">
              Portfolio Project
            </p>
            <p className="mt-1 text-sm font-semibold text-slate-950">
              Courts Booking System
            </p>
          </div>

          <nav
            className={[
              "flex flex-wrap items-center gap-2 xl:min-w-0",
              me ? "xl:justify-center" : "xl:justify-end",
            ].join(" ")}
          >
            <NavLinkItem to="/" isActive={pathname === "/"}>
              Reservar
            </NavLinkItem>

            {!me && (
              <NavLinkItem to="/login" isActive={pathname === "/login"}>
                {"Iniciar sesión"}
              </NavLinkItem>
            )}

            {me && (
              <NavLinkItem to="/validate" isActive={pathname === "/validate"}>
                Validar token
              </NavLinkItem>
            )}

            {me?.role === "ADMIN" && (
              <NavLinkItem
                to="/admin/bookings"
                isActive={pathname === "/admin/bookings"}
              >
                Admin reservas
              </NavLinkItem>
            )}

            {me?.role === "ADMIN" && (
              <NavLinkItem to="/ai-demo" isActive={pathname === "/ai-demo"}>
                Demo IA
              </NavLinkItem>
            )}
          </nav>

          {(me || authLoading) && (
            <div className="hidden justify-end lg:flex xl:hidden">
              <SessionPill
                me={me}
                loading={authLoading}
                onLogout={onLogout}
              />
            </div>
          )}

          <div className="hidden items-center justify-end xl:flex">
            {me || authLoading ? (
              <SessionPill
                me={me}
                loading={authLoading}
                onLogout={onLogout}
              />
            ) : null}
          </div>
        </div>
      </div>
    </header>
  );
}