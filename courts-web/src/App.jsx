import { BrowserRouter, Routes, Route, NavLink } from "react-router-dom";
import Home from "./pages/Home";
import ValidateBooking from "./pages/ValidateBooking";
import AdminBookings from "./pages/AdminBookings";


const linkStyle = ({ isActive }) => ({
  padding: "8px 12px",
  borderRadius: 10,
  border: "1px solid #444",
  textDecoration: "none",
  color: "inherit",
  opacity: isActive ? 1 : 0.7,
});

export default function App() {
  return (
    <BrowserRouter>
      <div style={{ padding: 12, display: "flex", gap: 10 }}>
        <NavLink to="/" style={linkStyle}>Reservar</NavLink>
        <NavLink to="/validate" style={linkStyle}>Validar token</NavLink>
        <NavLink to="/admin/bookings" style={linkStyle}>Admin reservas</NavLink>
      </div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/validate" element={<ValidateBooking />} />
        <Route path="/admin/bookings" element={<AdminBookings />} />
      </Routes>
    </BrowserRouter>
  );
}
