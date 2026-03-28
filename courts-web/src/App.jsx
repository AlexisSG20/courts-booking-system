import { useEffect, useCallback, useState } from "react";
import { Routes, Route, Navigate, useLocation, useNavigate } from "react-router-dom";

import AdminBookings from "./pages/AdminBookings";
import Home from "./pages/Home";
import ValidateBooking from "./pages/ValidateBooking";
import AIDemo from "./pages/AIDemo";
import Login from "./pages/Login";

import AppHeader from "./components/Layout/AppHeader";
import AppFooter from "./components/Layout/AppFooter";

import { getAccessToken, logout as authLogout } from "./lib/auth";
import { getMe } from "./lib/me";

function AppShell({ me, refreshMe, authLoading, setAuthLoading }) {
  const location = useLocation();
  const navigate = useNavigate();

  async function handleGlobalLogout() {
    setAuthLoading(true);

    try {
      await authLogout();
    } catch {
      // ignoramos error y limpiamos igual el estado local
    } finally {
      await refreshMe();
      setAuthLoading(false);
      navigate("/login", { replace: true });
    }
  }

  return (
    <div className="min-h-screen bg-transparent text-gray-900">
      <AppHeader
        me={me}
        pathname={location.pathname}
        authLoading={authLoading}
        onLogout={handleGlobalLogout}
      />

      <div className="flex min-h-[calc(100vh-73px)] flex-col">
        <div className="flex-1">
          <Routes>
            <Route
              path="/login"
              element={<Login onAuthChange={refreshMe} me={me} />}
            />

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
                  <Navigate
                    to={getAccessToken() ? "/validate" : "/login"}
                    replace
                  />
                )
              }
            />

            <Route
              path="/ai-demo"
              element={
                me?.role === "ADMIN" ? (
                  <AIDemo />
                ) : (
                  <Navigate to="/" replace />
                )
              }
            />
          </Routes>
        </div>

        <AppFooter />
      </div>
    </div>
  );
}

export default function App() {
  const [me, setMe] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  const refreshMe = useCallback(async () => {
    if (!getAccessToken()) {
      setMe(null);
      return;
    }

    try {
      const user = await getMe();
      setMe(user);
    } catch {
      setMe(null);
    }
  }, []);

  useEffect(() => {
    let ignore = false;

    async function run() {
      setAuthLoading(true);
      await refreshMe();
      if (!ignore) {
        setAuthLoading(false);
      }
    }

    run();

    return () => {
      ignore = true;
    };
  }, [refreshMe]);

  return (
    <AppShell
      me={me}
      refreshMe={refreshMe}
      authLoading={authLoading}
      setAuthLoading={setAuthLoading}
    />
  );
}