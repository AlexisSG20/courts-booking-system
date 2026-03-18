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
    <section className="rounded-[24px] border border-white/10 bg-slate-950/70 p-6 shadow-[0_0_0_1px_rgba(255,255,255,0.03)] backdrop-blur">
      <div className="mb-5 flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
            Resultado
          </p>
          <h2 className="mt-2 text-2xl font-semibold text-white">
            {isUsed ? "Reserva ya utilizada" : "Reserva válida"}
          </h2>
          <p className="mt-2 text-sm leading-6 text-slate-400">
            Revisa la información antes de registrar el ingreso.
          </p>
        </div>

        <div
          className={`rounded-2xl px-3 py-2 text-xs font-medium ${
            isUsed
              ? "border border-rose-400/20 bg-rose-500/10 text-rose-300"
              : "border border-emerald-400/20 bg-emerald-500/10 text-emerald-300"
          }`}
        >
          {isUsed ? "Usada" : "Lista para check-in"}
        </div>
      </div>

      {!isUsed && (
        <button
          onClick={checkIn}
          disabled={checkingIn}
          className="cursor-pointer rounded-2xl bg-cyan-400 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {checkingIn ? "Marcando..." : "Marcar como usada (check-in)"}
        </button>
      )}

      {isUsed && booking.usedAt && (
        <div className="mb-6 rounded-2xl border border-rose-400/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
          Esta reserva ya fue usada el{" "}
          <span className="font-semibold">
            {new Date(booking.usedAt).toLocaleString()}
          </span>
          .
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
          <p className="text-xs uppercase tracking-[0.25em] text-slate-500">
            Booking ID
          </p>
          <p className="mt-2 text-lg font-semibold text-white">{booking.id}</p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
          <p className="text-xs uppercase tracking-[0.25em] text-slate-500">
            Court ID
          </p>
          <p className="mt-2 text-lg font-semibold text-white">
            {booking.courtId}
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
          <p className="text-xs uppercase tracking-[0.25em] text-slate-500">
            Fecha
          </p>
          <p className="mt-2 text-lg font-semibold text-white">
            {formatDate(booking.date)}
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
          <p className="text-xs uppercase tracking-[0.25em] text-slate-500">
            Horario
          </p>
          <p className="mt-2 text-lg font-semibold text-white">
            {formatHour(booking.startHour)} - {formatHour(booking.endHour)}
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
          <p className="text-xs uppercase tracking-[0.25em] text-slate-500">
            Personas
          </p>
          <p className="mt-2 text-lg font-semibold text-white">
            {booking.peopleCount}
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
          <p className="text-xs uppercase tracking-[0.25em] text-slate-500">
            Total
          </p>
          <p className="mt-2 text-lg font-semibold text-white">
            S/ {booking.totalPrice}
          </p>
        </div>
      </div>

      <div className="mt-4 rounded-2xl border border-white/10 bg-slate-950 p-4">
        <p className="text-xs uppercase tracking-[0.25em] text-slate-500">
          Token
        </p>
        <p className="mt-2 break-all text-sm text-slate-300">{booking.token}</p>
      </div>
    </section>
  );
}