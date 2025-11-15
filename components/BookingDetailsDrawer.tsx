import React from 'react';

type Booking = any;

type Props = {
  open: boolean;
  booking: Booking | null;
  onClose: () => void;
  onApprove?: (id: string) => void;
  onReject?: (id: string) => void;
};

function Badge({ label, color }: { label: string; color: string }) {
  return <span className={`px-2 py-0.5 rounded-full text-xs ${color}`}>{label}</span>;
}

export default function BookingDetailsDrawer({ open, booking, onClose, onApprove, onReject }: Props) {
  const id = booking ? String(booking.id || booking._id || '') : '';
  const status = (booking?.status || 'pending').toLowerCase();
  const statusColor = status === 'approved'
    ? 'bg-green-100 text-green-800'
    : status === 'declined'
    ? 'bg-red-100 text-red-800'
    : 'bg-yellow-100 text-yellow-800';
  const isFinalized = status === 'approved' || status === 'declined' || status === 'confirmed';

  const customerName = (booking?.customer && booking.customer.name) || booking?.userName || booking?.customerName || '—';
  const customerEmail = (booking?.customer && booking.customer.email) || booking?.userEmail || (booking as any)?.customerEmail || '—';
  const customerPhone = (booking?.customer && booking.customer.phone) || (booking as any)?.customerContact || '—';
  const customerMessage = booking?.message || booking?.note || '—';

  const hallName = booking?.hall?.name || booking?.hallName || '—';
  const hallPrice = typeof booking?.hall?.price === 'number' ? booking.hall.price : undefined;
  const start = booking?.startDate ? new Date(booking.startDate) : (booking?.eventDateTime ? new Date(booking.eventDateTime) : null);
  const end = booking?.endDate ? new Date(booking.endDate) : null;
  const dateStr = start && end && start.toDateString() !== end.toDateString()
    ? `${start.toLocaleDateString()} - ${end.toLocaleDateString()}`
    : (start ? start.toLocaleDateString() : '—');
  const timeStr = start && start.getHours() + start.getMinutes() !== 0 ? start.toLocaleTimeString() : '—';
  const guests = booking?.guests ?? booking?.hall?.capacity ?? '—';
  const eventType = booking?.eventType || '—';
  const requirements = booking?.requirements || booking?.specialRequests || booking?.specialRequirements || '—';

  const amount = (typeof hallPrice === 'number' ? hallPrice : (booking?.totalPrice ?? booking?.amountToOwner ?? booking?.grossAmount));
  const paymentStatus = (booking?.paymentStatus || 'pending').toLowerCase();
  const transactionId = booking?.paymentId || booking?.transactionId || '—';
  const orderId = booking?.orderId || '—';
  const paymentMode = booking?.finalPaymentMethod || booking?.paymentMode || booking?.mode || '—';
  const advancePaid = typeof booking?.advancePaid === 'boolean' ? (booking.advancePaid ? 'Yes' : 'No') : '—';
  const advanceAmountPaid = typeof booking?.advanceAmountPaid === 'number' ? `₹${booking.advanceAmountPaid}` : '—';
  const remainingAmountComputed = typeof amount === 'number' ? Math.max(0, amount - (typeof booking?.advanceAmountPaid === 'number' ? booking.advanceAmountPaid : 0)) : null;
  const remainingAmount = (paymentStatus === 'pending' || paymentStatus === 'unpaid' || paymentStatus === 'partial')
    ? (remainingAmountComputed !== null ? `₹${remainingAmountComputed}` : '—')
    : (typeof booking?.remainingAmount === 'number' ? `₹${booking.remainingAmount}` : '—');

  const approve = () => id && onApprove && onApprove(id);
  const reject = () => id && onReject && onReject(id);

  return (
    <div className={`fixed inset-0 z-40 ${open ? '' : 'pointer-events-none'}`} aria-hidden={!open}>
      {/* Backdrop */}
      <div
        className={`absolute inset-0 bg-black/30 transition-opacity ${open ? 'opacity-100' : 'opacity-0'}`}
        onClick={onClose}
      />
      {/* Panel */}
      <aside
        className={`absolute right-0 top-0 h-full w-[460px] max-w-[90vw] bg-white shadow-xl border-l border-gray-200 transform transition-transform ${open ? 'translate-x-0' : 'translate-x-full'}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="booking-details-title"
      >
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
          <div>
            <h2 id="booking-details-title" className="text-sm font-semibold text-gray-900">Booking Details</h2>
            <p className="text-xs text-gray-500">ID: {id || '—'}</p>
          </div>
          <div className="flex items-center gap-3">
            <Badge label={status} color={statusColor} />
            <button aria-label="Close" onClick={onClose} className="p-2 rounded hover:bg-gray-100">
              ✕
            </button>
          </div>
        </div>

        <div className="overflow-y-auto h-full pb-28">
          {/* Section 1 — Customer Information */}
          <section className="px-4 py-3">
            <h3 className="text-xs font-semibold text-blue-700 mb-2">Customer Information</h3>
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gray-200" />
                <div>
                  <p className="text-sm font-medium text-gray-900">{customerName}</p>
                  <p className="text-xs text-gray-600">{customerEmail}</p>
                </div>
              </div>
              <div className="mt-3 space-y-1 text-sm text-gray-700">
                <p className="flex items-center gap-2"><span>📞</span>{customerPhone}</p>
                <p className="flex items-center gap-2"><span>📝</span>{customerMessage}</p>
              </div>
            </div>
          </section>

          {/* Section 2 — Booking Information */}
          <section className="px-4 py-3">
            <h3 className="text-xs font-semibold text-blue-700 mb-2">Booking Information</h3>
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-3 space-y-2 text-sm">
              <InfoRow label="Hall Name" value={hallName} />
              <InfoRow label="Event Date" value={dateStr} />
              <InfoRow label="Event Time" value={timeStr} />
              <InfoRow label="Guests" value={String(guests)} />
              <InfoRow label="Event Type" value={eventType} />
              <InfoRow label="Special Requirements" value={requirements} />
            </div>
          </section>

          {/* Section 3 — Payment Information */}
          <section className="px-4 py-3">
            <h3 className="text-xs font-semibold text-blue-700 mb-2">Payment Information</h3>
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-3 space-y-2 text-sm">
              <InfoRow label="Amount" value={typeof amount === 'number' ? `₹${amount}` : '—'} />
              <InfoRow label="Remaining Amount" value={remainingAmount} />
              <InfoRow label="Payment Status" value={paymentStatus} />
              <InfoRow label="Transaction ID" value={transactionId} />
              <InfoRow label="Order ID" value={orderId} />
              <InfoRow label="Payment Mode" value={paymentMode} />
              <InfoRow label="Advance Paid" value={advancePaid} />
              <InfoRow label="Advance Amount" value={advanceAmountPaid} />
            </div>
          </section>
        </div>

        {/* Section 4 — Actions */}
        {!isFinalized && (
          <div className="absolute bottom-0 left-0 right-0 border-t border-gray-100 bg-white p-3 flex gap-2">
            <button onClick={approve} className="flex-1 bg-blue-600 text-white px-3 py-2 rounded hover:bg-blue-700">Approve</button>
            <button onClick={reject} className="flex-1 bg-red-600 text-white px-3 py-2 rounded hover:bg-red-700">Reject</button>
          </div>
        )}
      </aside>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-gray-600">{label}</span>
      <span className="text-gray-900 font-medium truncate ml-4">{value}</span>
    </div>
  );
}