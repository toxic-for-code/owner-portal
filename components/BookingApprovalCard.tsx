import React from 'react';

type Props = {
  bookingId: string;
  statusText: string;
  statusClass: string; // kept for backward compatibility if parent computes color
  eventText: string;
  hallName: string;
  customerName: string;
  customerPhone?: string;
  customerEmail?: string;
  paymentStatus: string;
  amountToOwner: number;
  advancePaid: number;
  dueAmount?: number;
  managerText?: string;
  remark: string;
  onRemarkChange: (value: string) => void;
  onApprove?: () => void;
  onDecline?: () => void;
  showActions?: boolean;
  bookingUrl?: string; // optional link for clickable Booking ID
};

export default function BookingApprovalCard({
  bookingId,
  statusText,
  statusClass,
  eventText,
  hallName,
  customerName,
  customerPhone,
  customerEmail,
  paymentStatus,
  amountToOwner,
  advancePaid,
  dueAmount = 0,
  managerText,
  remark,
  onRemarkChange,
  onApprove,
  onDecline,
  showActions = true,
  bookingUrl,
}: Props) {
  const normalizedStatus = (statusText || '').toString().toLowerCase().replace(/\s+/g, '_');
  const computedDue = typeof dueAmount === 'number' ? dueAmount : Math.max((amountToOwner || 0) - (advancePaid || 0), 0);

  return (
    <div className="w-full rounded-2xl bg-white shadow-lg border border-gray-100 p-5">
      <div className="relative rounded-xl bg-blue-50 border border-blue-100 p-5">
        {/* Status pill overlapping top-right */}
        <div className="absolute -top-3 right-4">
          <span className={`inline-flex items-center px-3 py-1 text-xs font-semibold rounded-full shadow-sm ring-1 ring-yellow-200 bg-yellow-100 text-yellow-800`}>
            {normalizedStatus || 'pending_owner_confirmation'}
          </span>
        </div>

        {/* Header: Booking ID clickable + Payment status */}
        <div className="flex items-start justify-between mb-4">
          {bookingUrl ? (
            <a href={bookingUrl} className="text-blue-600 hover:text-blue-700 hover:underline font-semibold">
              Booking ID: #{bookingId}
            </a>
          ) : (
            <button type="button" className="text-blue-600 hover:text-blue-700 hover:underline font-semibold cursor-pointer">
              Booking ID: #{bookingId}
            </button>
          )}
          <span className="inline-flex px-2.5 py-1 text-xs font-medium rounded-full bg-white text-gray-700 border border-gray-200 shadow-sm">
            {paymentStatus}
          </span>
        </div>

        {/* Details grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="rounded-lg bg-white/60 border border-blue-100 p-3">
            <p className="text-xs font-medium text-blue-700">Event details</p>
            <p className="mt-1 text-gray-900">{eventText}</p>
          </div>
          <div className="rounded-lg bg-white/60 border border-blue-100 p-3">
            <p className="text-xs font-medium text-blue-700">Hall name</p>
            <p className="mt-1 text-gray-900">{hallName}</p>
          </div>

          <div className="rounded-lg bg-white/60 border border-blue-100 p-3">
            <p className="text-xs font-medium text-blue-700">Customer name</p>
            <p className="mt-1 text-gray-900">{customerName}</p>
          </div>
          <div className="rounded-lg bg-white/60 border border-blue-100 p-3">
            <p className="text-xs font-medium text-blue-700">Customer phone</p>
            <p className="mt-1 text-gray-900">
              {customerPhone ? (
                <a href={`tel:${customerPhone.replace(/\s+/g, '')}`} className="text-blue-600 hover:text-blue-700 hover:underline">
                  {customerPhone}
                </a>
              ) : (
                '—'
              )}
            </p>
          </div>
          <div className="rounded-lg bg-white/60 border border-blue-100 p-3">
            <p className="text-xs font-medium text-blue-700">Customer email</p>
            <p className="mt-1 text-gray-900">
              {customerEmail ? (
                <a href={`mailto:${customerEmail}`} className="text-blue-600 hover:text-blue-700 hover:underline">
                  {customerEmail}
                </a>
              ) : (
                '—'
              )}
            </p>
          </div>
          <div className="rounded-lg bg-white/60 border border-blue-100 p-3">
            <p className="text-xs font-medium text-blue-700">Amount to Owner</p>
            <p className="mt-1 text-gray-900">₹{amountToOwner}</p>
          </div>

          <div className="rounded-lg bg-white/60 border border-blue-100 p-3">
            <p className="text-xs font-medium text-blue-700">Advance Paid</p>
            <p className="mt-1 text-gray-900">₹{advancePaid}</p>
          </div>
          <div className="rounded-lg bg-white/60 border border-blue-100 p-3">
            <p className="text-xs font-medium text-blue-700">Due</p>
            <p className="mt-1 text-gray-900">₹{computedDue}</p>
          </div>

          <div className="rounded-lg bg-white/60 border border-blue-100 p-3 md:col-span-2">
            <p className="text-xs font-medium text-blue-700">Manager</p>
            <p className="mt-1 text-gray-900">{managerText || 'Not Assigned'}</p>
          </div>
        </div>

        {/* Remark & Actions */}
        {showActions && normalizedStatus === 'pending_owner_confirmation' && (
          <div className="mt-5 pt-4 border-t border-blue-100">
            <label className="block text-xs font-medium text-gray-700 mb-1">Add remark (optional)</label>
            <input
              type="text"
              placeholder="Add remark (optional)"
              className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              value={remark}
              onChange={(e) => onRemarkChange(e.target.value)}
            />
            <div className="mt-4 flex gap-3">
              <button
                onClick={onApprove}
                className="flex-1 inline-flex items-center justify-center rounded-lg bg-green-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                Approve
              </button>
              <button
                onClick={onDecline}
                className="flex-1 inline-flex items-center justify-center rounded-lg bg-red-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                Decline
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}