import QRCode from "react-qr-code";

export default function BookingConfirmation({ confirmation }) {
  if (!confirmation) return null;

  return (
    <section className="rounded-3xl border border-emerald-400/20 bg-emerald-400/10 p-6 shadow-lg shadow-emerald-950/20">
      <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-center">
        <div>
          <p className="text-sm uppercase tracking-[0.22em] text-emerald-300">
            Reserva confirmada
          </p>
          <h2 className="mt-2 text-2xl font-semibold text-white">
            Tu reserva fue creada correctamente
          </h2>

          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            <div className="rounded-2xl border border-white/10 bg-slate-950/40 p-4">
              <p className="text-xs uppercase tracking-wide text-slate-400">
                Booking ID
              </p>
              <p className="mt-2 text-lg font-semibold text-white">
                {confirmation.bookingId}
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-slate-950/40 p-4">
              <p className="text-xs uppercase tracking-wide text-slate-400">
                Total
              </p>
              <p className="mt-2 text-lg font-semibold text-white">
                S/ {confirmation.totalPrice}
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-slate-950/40 p-4">
              <p className="text-xs uppercase tracking-wide text-slate-400">
                Token
              </p>
              <p className="mt-2 break-all text-sm font-medium text-white">
                {confirmation.token}
              </p>
            </div>
          </div>
        </div>

        <div className="flex justify-center">
          <div className="rounded-3xl bg-white p-4 shadow-xl">
            <QRCode value={String(confirmation.token)} />
          </div>
        </div>
      </div>
    </section>
  );
}