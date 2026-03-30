import { useState } from "react";
import { Link } from "react-router-dom";
import SessionPill from "./SessionPill";

function NavLinkItem({ to, children, isActive }) {
  return (
    <Link
      to={to}
      className={[
        "inline-flex h-10 sm:h-11 items-center justify-center rounded-full border px-3 sm:px-5 text-xs sm:text-sm font-medium transition-all duration-200",
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
  const [menuOpen, setMenuOpen] = useState(false);
  const showSession = Boolean(me || authLoading);

  const navItems = [
    { to: "/", label: "Reservar" },
    ...(me ? [{ to: "/validate", label: "Validar token" }] : []),
    ...(!me ? [{ to: "/login", label: "Iniciar sesión" }] : []),
    ...(me?.role === "ADMIN" ? [{ to: "/admin/bookings", label: "Admin reservas" }] : []),
    ...(me?.role === "ADMIN" ? [{ to: "/ai-demo", label: "Demo IA" }] : []),
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/90 backdrop-blur-xl">
      <div className="mx-auto w-full max-w-7xl px-4 py-3 sm:py-4 md:py-5 sm:px-6 lg:px-8">
        <div
          className={[
            "flex items-center justify-between gap-4",
            showSession ? "lg:grid lg:grid-cols-[auto_1fr_auto]" : "",
          ].join(" ")}
        >
          {/* Logo */}
          <div className="min-w-0 flex items-center gap-2.5 sm:gap-3">
            <img
              src="/ball.svg?v=3"
              alt="Pelota deportiva"
              className="h-9 w-9 rounded-full border border-slate-200 bg-white p-1 shadow-sm"
            />
            <div>
              <p className="text-[9px] sm:text-[10px] uppercase tracking-[0.32em] text-slate-500">
                Sistema de reservas
              </p>
              <p className="mt-0.5 sm:mt-1 text-xs sm:text-sm font-semibold text-slate-950">
                Lozas Deportivas
              </p>
            </div>
          </div>

          {/* Desktop Nav */}
          <nav
            className={[
              "hidden lg:flex items-center gap-2",
              showSession ? "justify-self-center justify-center" : "ml-auto justify-end",
            ].join(" ")}
          >
            {navItems.map(({ to, label }) => (
              <NavLinkItem key={to} to={to} isActive={pathname === to}>
                {label}
              </NavLinkItem>
            ))}
          </nav>

          {/* Desktop Session + Mobile Hamburger */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Mobile Hamburger */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="lg:hidden inline-flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 hover:bg-slate-50"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {menuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>

            {/* Desktop Session Pill */}
            <div className="hidden lg:block">
              {showSession ? (
                <SessionPill me={me} loading={authLoading} onLogout={onLogout} />
              ) : null}
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="lg:hidden mt-4 pb-4 border-t border-slate-200 pt-4">
            <nav className="flex flex-col gap-2">
              {navItems.map(({ to, label }) => (
                <Link
                  key={to}
                  to={to}
                  onClick={() => setMenuOpen(false)}
                  className={[
                    "block px-4 py-3 rounded-lg text-sm font-medium transition-all",
                    pathname === to
                      ? "bg-emerald-500 text-white"
                      : "text-slate-700 hover:bg-slate-50",
                  ].join(" ")}
                >
                  {label}
                </Link>
              ))}
            </nav>

            {/* Mobile Session in Menu */}
            {(me || authLoading) && (
              <div className="mt-4 pt-4 border-t border-slate-200">
                <SessionPill me={me} loading={authLoading} onLogout={onLogout} />
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
