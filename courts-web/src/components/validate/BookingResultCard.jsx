function formatHour(hour) {
  return `${hour}:00`;
}

function formatDate(date) {
  return date;
}

export default function BookingResultCard({
  booking,
  checkingIn,
  checkIn,
}) {
  if (!booking) return null;

  const isUsed = Boolean(booking?.usedAt);

  return (
    <section className="rounded-[2rem] border border-white/12 bg-slate-950/44 p-6 shadow-[0_24px_80px_rgba(15,23,42,0.2)] backdrop-blur-md">
      <div className="mb-5 flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-white/52">
            Resultado
          </p>
          <h2 className="mt-2 text-2xl font-semibold text-white">
            {isUsed ? "Reserva ya utilizada" : "Reserva valida"}
          </h2>
          <p className="mt-2 text-sm leading-6 text-slate-200/78">
            Revisa la informacion antes de registrar el ingreso.
          </p>
        </div>

        <div
          className={`rounded-2xl border px-3 py-2 text-xs font-medium ${
            isUsed
              ? "border-rose-400/24 bg-rose-400/10 text-rose-100"
              : "border-emerald-400/24 bg-emerald-400/10 text-emerald-100"
          }`}
        >
          {isUsed ? "Usada" : "Lista para check-in"}
        </div>
      </div>

      {!isUsed && (
        <button
          onClick={checkIn}
          disabled={checkingIn}
          className="cursor-pointer rounded-2xl bg-emerald-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {checkingIn ? "Marcando..." : "Marcar como usada (check-in)"}
        </button>
      )}

      {isUsed && booking.usedAt && (
        <div className="mb-6 rounded-2xl border border-rose-400/24 bg-rose-400/10 px-4 py-3 text-sm text-rose-100">
          Esta reserva ya fue usada el{" "}
          <span className="font-semibold">
            {new Date(booking.usedAt).toLocaleString()}
          </span>
          .
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <div className="rounded-2xl border border-white/10 bg-white/6 p-4">
          <p className="text-xs uppercase tracking-[0.25em] text-white/45">
            Booking ID
          </p>
          <p className="mt-2 text-lg font-semibold text-white">{booking.id}</p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/6 p-4">
          <p className="text-xs uppercase tracking-[0.25em] text-white/45">
            Court ID
          </p>
          <p className="mt-2 text-lg font-semibold text-white">
            {booking.courtId}
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/6 p-4">
          <p className="text-xs uppercase tracking-[0.25em] text-white/45">
            Fecha
          </p>
          <p className="mt-2 text-lg font-semibold text-white">
            {formatDate(booking.date)}
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/6 p-4">
          <p className="text-xs uppercase tracking-[0.25em] text-white/45">
            Horario
          </p>
          <p className="mt-2 text-lg font-semibold text-white">
            {formatHour(booking.startHour)} - {formatHour(booking.endHour)}
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/6 p-4">
          <p className="text-xs uppercase tracking-[0.25em] text-white/45">
            Personas
          </p>
          <p className="mt-2 text-lg font-semibold text-white">
            {booking.peopleCount}
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/6 p-4">
          <p className="text-xs uppercase tracking-[0.25em] text-white/45">
            Total
          </p>
          <p className="mt-2 text-lg font-semibold text-white">
            S/ {booking.totalPrice}
          </p>
        </div>
      </div>

      <div className="mt-4 rounded-2xl border border-white/10 bg-white/6 p-4">
        <p className="text-xs uppercase tracking-[0.25em] text-white/45">
          Token
        </p>
        <p className="mt-2 break-all text-sm text-slate-200/82">{booking.token}</p>
      </div>
    </section>
  );
}
