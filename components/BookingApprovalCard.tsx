import React from 'react';

type Props = {
  bookingId: string;
  statusText: string;
  statusClass: string;
  eventText: string;
  hallName: string;
  customerName: string;
  customerPhone?: string;
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
};

export default function BookingApprovalCard({
  bookingId,
  statusText,
  statusClass,
  eventText,
  hallName,
  customerName,
  customerPhone,
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
}: Props) {
  const normalizedStatus = (statusText || '').toString().toLowerCase().replace(/\s+/g, '_');
  return (
    <div className="rounded-xl shadow-sm bg-blue-50 p-4 md:p-5 w-full">
      {/* Header: ID + status */}
      <div className="flex items-center gap-2 mb-3">
        <span className="text-lg font-semibold text-blue-800">Booking ID: {bookingId}</span>
        <span className={`text-xs font-bold px-2 py-1 rounded ${statusClass}`}>{statusText}</span>
      </div>

      {/* Details */}
      <div className="space-y-1 text-gray-700">
        <div><span className="font-semibold">Event:</span> {eventText}</div>
        <div><span className="font-semibold">Hall:</span> {hallName}</div>
        <div><span className="font-semibold">Customer:</span> {customerName}{customerPhone ? ` — ${customerPhone}` : ''}</div>
        <div><span className="font-semibold">Payment Status:</span> {paymentStatus}</div>
        <div><span className="font-semibold">Amount to Owner:</span> ₹{amountToOwner}</div>
        <div>
          <span className="font-semibold">Advance Paid:</span> ₹{advancePaid}{' '}
          <span className="font-semibold">Due:</span> ₹{typeof dueAmount === 'number' ? dueAmount : Math.max((amountToOwner || 0) - (advancePaid || 0), 0)}
        </div>
        <div><span className="font-semibold">Manager:</span> {managerText || 'Not Assigned'}</div>
      </div>

      {normalizedStatus === 'pending_owner_confirmation' && (
        <>
          {/* Remark input */}
          <div className="mt-4">
            <input
              type="text"
              placeholder="Add remark (optional)"
              className="w-full rounded-lg border border-blue-200 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              value={remark}
              onChange={(e) => onRemarkChange(e.target.value)}
            />
          </div>

          {/* Actions */}
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
        </>
      )}
    </div>
  );
}