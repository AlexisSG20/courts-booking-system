import { useEffect, useMemo, useState } from "react";
import HomeHero from "../components/Home/HomeHero";
import BookingFormCard from "../components/Home/BookingFormCard";
import BookingConfirmation from "../components/Home/BookingConfirmation";
import TimeSlots from "../components/Home/TimeSlots";
import BookedHours from "../components/Home/BookedHours";

const API = "/api";
const sidePanelBase =
  "pointer-events-none absolute inset-y-0 z-0 hidden overflow-hidden xl:block";
const sidePanelWidth = "clamp(10rem, calc((100vw - 80rem) / 2 + 2rem), 22rem)";
const rightSidePanelWidth = "clamp(8rem, calc((100vw - 80rem) / 2 + 0.5rem), 18rem)";

const leftSideVisual = {
  backgroundImage:
    "linear-gradient(90deg, rgba(2, 6, 23, 0.26) 0%, rgba(2, 6, 23, 0.08) 42%, rgba(2, 6, 23, 0.02) 68%, transparent 100%), url('https://images.unsplash.com/photo-1511886929837-354d827aae26?auto=format&fit=crop&w=1200&h=1800&q=80')",
  backgroundSize: "cover",
  backgroundRepeat: "no-repeat",
  backgroundPosition: "24% center",
  filter: "grayscale(2%) saturate(1.08) contrast(1.12) brightness(1.02)",
  WebkitMaskImage:
    "linear-gradient(90deg, rgba(0,0,0,0.98) 0%, rgba(0,0,0,0.96) 60%, rgba(0,0,0,0.62) 80%, transparent 100%)",
  maskImage:
    "linear-gradient(90deg, rgba(0,0,0,0.98) 0%, rgba(0,0,0,0.96) 60%, rgba(0,0,0,0.62) 80%, transparent 100%)",
};

const rightSideVisual = {
  backgroundImage:
    "linear-gradient(270deg, rgba(2, 6, 23, 0.38) 0%, rgba(2, 6, 23, 0.16) 42%, rgba(2, 6, 23, 0.04) 68%, transparent 100%), url('https://images.unsplash.com/photo-1767730957756-0b4613111554?auto=format&fit=crop&w=1200&h=1800&q=80')",
  backgroundSize: "cover",
  backgroundRepeat: "no-repeat",
  backgroundPosition: "72% 58%",
  filter: "grayscale(1%) saturate(1.08) contrast(1.12) brightness(1.03)",
  WebkitMaskImage:
    "linear-gradient(270deg, rgba(0,0,0,0.98) 0%, rgba(0,0,0,0.96) 60%, rgba(0,0,0,0.62) 80%, transparent 100%)",
  maskImage:
    "linear-gradient(270deg, rgba(0,0,0,0.98) 0%, rgba(0,0,0,0.96) 60%, rgba(0,0,0,0.62) 80%, transparent 100%)",
};

function todayYYYYMMDD() {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

export default function Home() {
  const [courts, setCourts] = useState([]);
  const [courtId, setCourtId] = useState("");
  const [date, setDate] = useState(todayYYYYMMDD());

  const [available, setAvailable] = useState([]);
  const [booked, setBooked] = useState([]);

  const [loadingCourts, setLoadingCourts] = useState(true);
  const [loadingAvail, setLoadingAvail] = useState(false);

  const [selectedHour, setSelectedHour] = useState(null);
  const [peopleCount, setPeopleCount] = useState(1);

  const [creating, setCreating] = useState(false);
  const [confirmation, setConfirmation] = useState(null);
  const [error, setError] = useState("");

  const endHour = useMemo(() => {
    if (selectedHour == null) return null;
    return selectedHour + 1;
  }, [selectedHour]);

  useEffect(() => {
    async function loadCourts() {
      setError("");
      setLoadingCourts(true);

      try {
        const res = await fetch(`${API}/courts`);
        if (!res.ok) throw new Error("Error al cargar courts");

        const data = await res.json();
        setCourts(data);

        if (data.length > 0) {
          setCourtId(String(data[0].id));
        }
      } catch (e) {
        setError(e.message);
      } finally {
        setLoadingCourts(false);
      }
    }

    loadCourts();
  }, []);

  async function loadAvailability(currentCourtId = courtId, currentDate = date) {
    if (!currentCourtId || !currentDate) return;

    setError("");
    setLoadingAvail(true);

    try {
      const res = await fetch(
        `${API}/availability?courtId=${encodeURIComponent(
          currentCourtId
        )}&date=${encodeURIComponent(currentDate)}`
      );

      if (!res.ok) {
        const err = await res.json().catch(() => null);
        throw new Error(err?.message ?? "Error al cargar disponibilidad");
      }

      const data = await res.json();
      setAvailable(data.available ?? []);
      setBooked(data.booked ?? []);
    } catch (e) {
      setError(e.message);
      setAvailable([]);
      setBooked([]);
    } finally {
      setLoadingAvail(false);
    }
  }

  useEffect(() => {
    setSelectedHour(null);
    setConfirmation(null);
    loadAvailability();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [courtId, date]);

  async function createBooking() {
    if (!courtId || !date || selectedHour == null) return;

    setCreating(true);
    setError("");
    setConfirmation(null);

    try {
      const payload = {
        courtId: Number(courtId),
        date,
        startHour: selectedHour,
        endHour: selectedHour + 1,
        peopleCount: Number(peopleCount),
      };

      const res = await fetch(`${API}/bookings`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        const msg =
          (Array.isArray(data?.message) ? data.message.join(", ") : data?.message) ||
          "Error creando reserva";
        throw new Error(msg);
      }

      setConfirmation(data);
      await loadAvailability(courtId, date);
      setSelectedHour(null);
    } catch (e) {
      setError(e.message);
    } finally {
      setCreating(false);
    }
  }

  return (
    <main className="relative min-h-screen overflow-x-hidden bg-transparent text-white">
      <div
        aria-hidden="true"
        className={`${sidePanelBase} left-0 opacity-68`}
        style={{ ...leftSideVisual, width: sidePanelWidth }}
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_24%,rgba(255,255,255,0.08),transparent_20%),linear-gradient(90deg,rgba(2,6,23,0.04)_0%,rgba(2,6,23,0.015)_44%,transparent_80%)]" />
      </div>

      <div
        aria-hidden="true"
        className={`${sidePanelBase} right-0 opacity-68`}
        style={{ ...rightSideVisual, width: rightSidePanelWidth }}
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_82%_28%,rgba(255,255,255,0.08),transparent_20%),linear-gradient(270deg,rgba(2,6,23,0.04)_0%,rgba(2,6,23,0.015)_44%,transparent_80%)]" />
      </div>

      <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-col gap-6 sm:gap-8 px-4 py-6 sm:py-8 md:px-6 lg:px-8">
        <HomeHero />

        {error && (
          <div className="rounded-lg sm:rounded-2xl border border-rose-400/20 bg-rose-400/10 px-4 py-3 text-xs sm:text-sm text-rose-200">
            {error}
          </div>
        )}

        <section className="grid gap-6 sm:gap-8 grid-cols-1 lg:grid-cols-[1.1fr_0.9fr]">
          <BookingFormCard
            courts={courts}
            courtId={courtId}
            setCourtId={setCourtId}
            date={date}
            setDate={setDate}
            peopleCount={peopleCount}
            setPeopleCount={setPeopleCount}
            loadingCourts={loadingCourts}
            creating={creating}
            selectedHour={selectedHour}
            endHour={endHour}
            onCreateBooking={createBooking}
          />

          <TimeSlots
            loadingAvail={loadingAvail}
            available={available}
            selectedHour={selectedHour}
            setSelectedHour={setSelectedHour}
            creating={creating}
          />
        </section>

        <BookingConfirmation confirmation={confirmation} />

        <BookedHours booked={booked} />
      </div>
    </main>
  );
}