import { useEffect, useMemo, useState } from "react";
import HomeHero from "../components/home/HomeHero";
import BookingFormCard from "../components/home/BookingFormCard";
import BookingConfirmation from "../components/home/BookingConfirmation";
import TimeSlots from "../components/home/TimeSlots";
import BookedHours from "../components/home/BookedHours";

const API = "/api";

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
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-8 sm:px-6 lg:px-8">
        <HomeHero />

        {error && (
          <div className="rounded-2xl border border-rose-400/20 bg-rose-400/10 px-4 py-3 text-sm text-rose-200">
            {error}
          </div>
        )}

        <section className="grid gap-8 xl:grid-cols-[1.1fr_0.9fr]">
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