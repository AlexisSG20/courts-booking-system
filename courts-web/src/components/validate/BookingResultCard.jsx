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
    <section className="rounded-[24px] border border-gray-200 bg-white p-6 shadow-lg">
      <div className="mb-5 flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-gray-500">
            Resultado
          </p>
          <h2 className="mt-2 text-2xl font-semibold text-gray-900">
            {isUsed ? "Reserva ya utilizada" : "Reserva válida"}
          </h2>
          <p className="mt-2 text-sm leading-6 text-gray-600">
            Revisa la información antes de registrar el ingreso.
          </p>
        </div>

        <div
          className={`rounded-2xl px-3 py-2 text-xs font-medium ${
            isUsed
              ? "border border-rose-200 bg-rose-50 text-rose-600"
              : "bg-emerald-500 text-white"
          }`}
        >
          {isUsed ? "Usada" : "Lista para check-in"}
        </div>
      </div>

      {!isUsed && (
        <button
          onClick={checkIn}
          disabled={checkingIn}
          className="cursor-pointer rounded-2xl bg-emerald-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-600 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {checkingIn ? "Marcando..." : "Marcar como usada (check-in)"}
        </button>
      )}

      {isUsed && booking.usedAt && (
        <div className="mb-6 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-600">
          Esta reserva ya fue usada el{" "}
          <span className="font-semibold">
            {new Date(booking.usedAt).toLocaleString()}
          </span>
          .
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4">
          <p className="text-xs uppercase tracking-[0.25em] text-gray-500">
            Booking ID
          </p>
          <p className="mt-2 text-lg font-semibold text-gray-900">{booking.id}</p>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4">
          <p className="text-xs uppercase tracking-[0.25em] text-gray-500">
            Court ID
          </p>
          <p className="mt-2 text-lg font-semibold text-gray-900">
            {booking.courtId}
          </p>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4">
          <p className="text-xs uppercase tracking-[0.25em] text-gray-500">
            Fecha
          </p>
          <p className="mt-2 text-lg font-semibold text-gray-900">
            {formatDate(booking.date)}
          </p>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4">
          <p className="text-xs uppercase tracking-[0.25em] text-gray-500">
            Horario
          </p>
          <p className="mt-2 text-lg font-semibold text-gray-900">
            {formatHour(booking.startHour)} - {formatHour(booking.endHour)}
          </p>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4">
          <p className="text-xs uppercase tracking-[0.25em] text-gray-500">
            Personas
          </p>
          <p className="mt-2 text-lg font-semibold text-gray-900">
            {booking.peopleCount}
          </p>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4">
          <p className="text-xs uppercase tracking-[0.25em] text-gray-500">
            Total
          </p>
          <p className="mt-2 text-lg font-semibold text-gray-900">
            S/ {booking.totalPrice}
          </p>
        </div>
      </div>

      <div className="mt-4 rounded-2xl border border-gray-200 bg-gray-100 p-4">
        <p className="text-xs uppercase tracking-[0.25em] text-gray-500">
          Token
        </p>
        <p className="mt-2 break-all text-sm text-gray-700">{booking.token}</p>
      </div>
    </section>
  );
}