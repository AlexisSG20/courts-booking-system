import { Link } from "react-router-dom";
import SessionPill from "./SessionPill";

function NavLinkItem({ to, children, isActive }) {
  return (
    <Link
      to={to}
      className={[
        "inline-flex h-11 items-center justify-center rounded-full px-5 text-sm font-medium transition",
        isActive
          ? "bg-white !text-slate-950 shadow-[0_8px_30px_rgba(255,255,255,0.08)] hover:!text-slate-950"
          : "text-slate-300 hover:bg-white/10 hover:text-white",
      ].join(" ")}
    >
      {children}
    </Link>
  );
}

export default function AppHeader({ me, pathname, authLoading, onLogout }) {
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/80 backdrop-blur-xl">
      <div className="mx-auto w-full max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 xl:grid xl:grid-cols-[220px_minmax(0,1fr)_auto] xl:items-center">
          <div className="min-w-0">
            <p className="text-[11px] uppercase tracking-[0.32em] text-slate-500">
              Portfolio Project
            </p>
            <p className="mt-1 text-sm font-semibold text-white">
              Courts Booking System
            </p>
          </div>

          <nav className="flex flex-wrap items-center gap-2 xl:justify-center">
            <NavLinkItem to="/" isActive={pathname === "/"}>
              Reservar
            </NavLinkItem>

            {!me && (
              <NavLinkItem to="/login" isActive={pathname === "/login"}>
                Iniciar sesión
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

          <div className="xl:justify-self-end">
            <SessionPill
              me={me}
              loading={authLoading}
              onLogout={onLogout}
            />
          </div>
        </div>
      </div>
    </header>
  );
}