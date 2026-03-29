import QRCode from "react-qr-code";

export default function BookingConfirmation({ confirmation }) {
  if (!confirmation) return null;

  return (
    <section className="rounded-2xl sm:rounded-3xl border border-emerald-200 bg-emerald-50 p-4 sm:p-6 shadow-lg">
      <div className="grid gap-4 sm:gap-6 grid-cols-1 lg:grid-cols-[1fr_auto] lg:items-center">
        <div>
          <p className="text-xs sm:text-sm uppercase tracking-[0.22em] text-emerald-700">
            Reserva confirmada
          </p>
          <h2 className="mt-2 text-xl sm:text-2xl font-semibold text-gray-900">
            Tu reserva fue creada correctamente
          </h2>

          <div className="mt-4 sm:mt-5 grid gap-2 sm:gap-3 grid-cols-1 sm:grid-cols-3">
            <div className="rounded-xl sm:rounded-2xl border border-gray-200 bg-white p-3 sm:p-4">
              <p className="text-xs uppercase tracking-wide text-gray-500">
                Booking ID
              </p>
              <p className="mt-2 text-base sm:text-lg font-semibold text-gray-900">
                {confirmation.bookingId}
              </p>
            </div>

            <div className="rounded-xl sm:rounded-2xl border border-gray-200 bg-white p-3 sm:p-4">
              <p className="text-xs uppercase tracking-wide text-gray-500">
                Total
              </p>
              <p className="mt-2 text-base sm:text-lg font-semibold text-gray-900">
                S/ {confirmation.totalPrice}
              </p>
            </div>

            <div className="rounded-xl sm:rounded-2xl border border-gray-200 bg-white p-3 sm:p-4">
              <p className="text-xs uppercase tracking-wide text-gray-500">
                Token
              </p>
              <p className="mt-2 break-all text-xs sm:text-sm font-medium text-gray-900">
                {confirmation.token}
              </p>
            </div>
          </div>
        </div>

        <div className="flex justify-center mt-4 sm:mt-0">
          <div className="rounded-2xl sm:rounded-3xl bg-white p-3 sm:p-4 shadow-xl">
            <QRCode value={String(confirmation.token)} />
          </div>
        </div>
      </div>
    </section>
  );
}