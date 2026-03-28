import { Link } from "react-router-dom";
import SessionPill from "./SessionPill";

function NavLinkItem({ to, children, isActive }) {
  return (
    <Link
      to={to}
      className={[
        "inline-flex h-11 items-center justify-center rounded-full px-5 text-sm font-medium transition",
        isActive
          ? "bg-emerald-500 text-white shadow-md hover:bg-emerald-600"
          : "text-gray-700 hover:text-emerald-600 hover:bg-gray-100",
      ].join(" ")}
    >
      {children}
    </Link>
  );
}

export default function AppHeader({ me, pathname, authLoading, onLogout }) {
  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white">
      <div className="mx-auto w-full max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 xl:grid xl:grid-cols-[220px_minmax(0,1fr)_auto] xl:items-center">
          <div className="min-w-0">
            <p className="text-[11px] uppercase tracking-[0.32em] text-gray-500">
              Portfolio Project
            </p>
            <p className="mt-1 text-sm font-semibold text-gray-900">
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