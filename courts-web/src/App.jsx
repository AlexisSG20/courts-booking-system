import { useEffect, useCallback, useState } from "react";
import { Routes, Route, Link, Navigate } from "react-router-dom";

import AdminBookings from "./pages/AdminBookings";
import Home from "./pages/Home";
import ValidateBooking from "./pages/ValidateBooking";

import { getAccessToken } from "./lib/auth";
import { getMe } from "./lib/me";

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

  return (
    <>
      <nav style={{ display: "flex", gap: 12 }}>
        <Link to="/">Reservar</Link>
        <Link to="/validate">Validar token</Link>

        {/* ✅ SOLO ADMIN ve Admin */}
        {me?.role === "ADMIN" && <Link to="/admin/bookings">Admin reservas</Link>}
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/validate" element={<ValidateBooking onAuthChange={refreshMe} />} />

        {/* ✅ Protección UI (además del backend) */}
        <Route
          path="/admin/bookings"
          element={
            me?.role === "ADMIN"
              ? <AdminBookings onAuthChange={refreshMe} />
              : <Navigate to="/validate" replace />
          }
        />
      </Routes>
    </>
  );
}