import { useEffect, useCallback, useState } from "react";
import { Routes, Route, Link, Navigate, useLocation } from "react-router-dom";

import AdminBookings from "./pages/AdminBookings";
import Home from "./pages/Home";
import ValidateBooking from "./pages/ValidateBooking";

import { getAccessToken } from "./lib/auth";
import { getMe } from "./lib/me";

function NavLinkItem({ to, children, isActive }) {
  return (
    <Link
      to={to}
      className={[
        "rounded-full px-4 py-2 text-sm font-medium transition",
        isActive
          ? "bg-white text-slate-950"
          : "text-slate-300 hover:bg-white/10 hover:text-white",
      ].join(" ")}
    >
      {children}
    </Link>
  );
}

function AppShell({ me, refreshMe }) {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-transparent">
      <header className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/75 backdrop-blur-xl">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-slate-500">
              Portfolio Project
            </p>
            <p className="text-sm font-semibold text-white">
              Courts Booking System
            </p>
          </div>

          <nav className="flex flex-wrap items-center gap-2">
            <NavLinkItem to="/" isActive={location.pathname === "/"}>
              Reservar
            </NavLinkItem>

            <NavLinkItem
              to="/validate"
              isActive={location.pathname === "/validate"}
            >
              Validar token
            </NavLinkItem>

            {me?.role === "ADMIN" && (
              <NavLinkItem
                to="/admin/bookings"
                isActive={location.pathname === "/admin/bookings"}
              >
                Admin reservas
              </NavLinkItem>
            )}
          </nav>
        </div>
      </header>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/validate"
          element={<ValidateBooking onAuthChange={refreshMe} />}
        />
        <Route
          path="/admin/bookings"
          element={
            me?.role === "ADMIN" ? (
              <AdminBookings onAuthChange={refreshMe} />
            ) : (
              <Navigate to="/validate" replace />
            )
          }
        />
      </Routes>
    </div>
  );
}

export default function App() {
  const [me, setMe] = useState(null);

  const refreshMe = useCallback(async () => {
    if (!getAccessToken()) {
      setMe(null);
      return;
    }
    const user = await getMe();
    setMe(user);
  }, []);

  useEffect(() => {
    refreshMe();
  }, [refreshMe]);

  return <AppShell me={me} refreshMe={refreshMe} />;
}