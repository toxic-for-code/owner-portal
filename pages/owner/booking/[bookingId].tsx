import React, { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/router';

type Booking = any;

function Badge({ label, tone }: { label: string; tone: 'approved' | 'pending' | 'declined' }) {
  const color = tone === 'approved' ? 'bg-green-100 text-green-800' : tone === 'declined' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800';
  return <span className={`px-2 py-0.5 rounded-full text-xs ${color}`}>{label}</span>;
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
      <h2 className="text-sm font-semibold text-blue-700 mb-3">{title}</h2>
      {children}
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between py-1">
      <span className="text-gray-600">{label}</span>
      <span className="text-gray-900 font-medium ml-4">{value}</span>
    </div>
  );
}

export default function BookingDetailsPage() {
  const router = useRouter();
  const { bookingId } = router.query as { bookingId?: string };
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!bookingId) return;
    let cancelled = false;
    async function fetchBooking() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/bookings/${bookingId}`);
        if (res.ok) {
          const data = await res.json();
          if (!cancelled) setBooking(data.booking || data);
        } else {
          // Fallback demo data
          if (!cancelled) setBooking({
            id: bookingId,
            status: 'pending',
            createdAt: new Date().toISOString(),
            customerName: 'Demo User',
            customerEmail: 'demo@example.com',
            customerPhone: '+91 99999 99999',
            note: 'Please arrange extra chairs',
            hallName: 'Grand Sapphire Hall',
            eventDateTime: new Date(Date.now() + 86400000).toISOString(),
            guests: 250,
            eventType: 'Wedding',
            requirements: 'Stage + Sound System',
            amountToOwner: 120000,
            paymentStatus: 'pending',
            paymentId: 'TXN-DEMO-1234',
            paymentMode: 'UPI',
          });
        }
      } catch (e) {
        setError('Failed to load booking');
      }
      setLoading(false);
    }
    fetchBooking();
    return () => { cancelled = true; };
  }, [bookingId]);

  const status = (booking?.status || 'pending').toLowerCase() as 'approved' | 'pending' | 'declined';
  const created = booking?.createdAt ? new Date(booking.createdAt).toLocaleString() : '—';
  const eventDateTime = booking?.eventDateTime ? new Date(booking.eventDateTime).toLocaleString() : '—';

  const onApprove = async () => {
    if (!booking) return;
    try {
      const id = String(booking.id || booking._id);
      const res = await fetch(`/api/bookings/${id}/approve`, { method: 'POST' });
      if (res.ok) setBooking((b: any) => ({ ...b, status: 'approved' }));
    } catch {}
  };
  const onReject = async () => {
    if (!booking) return;
    try {
      const id = String(booking.id || booking._id);
      const res = await fetch(`/api/bookings/${id}/decline`, { method: 'POST' });
      if (res.ok) setBooking((b: any) => ({ ...b, status: 'declined' }));
    } catch {}
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Bar */}
      <div className="sticky top-0 z-10 bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img src="/logo.png" alt="WeEnYou Logo" className="h-8 w-8" />
            <span className="font-semibold text-gray-900">WeEnYou Hall Owner Portal</span>
          </div>
          <a href="/dashboard" className="text-sm text-blue-700 hover:underline">Back to Dashboard</a>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-6 space-y-6">
        {/* Booking Overview */}
        <Card title="Booking Overview">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Booking ID</p>
              <p className="text-base font-semibold text-gray-900">#{String(booking?.id || booking?._id || bookingId || '—')}</p>
              <p className="mt-1 text-xs text-gray-500">Created: {created}</p>
            </div>
            <Badge label={status} tone={status} />
          </div>
        </Card>

        {/* Customer Details */}
        <Card title="Customer Details">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Row label="Name" value={(booking?.customer?.name || booking?.customerName || '—')} />
            <Row label="Email" value={(booking?.customer?.email || booking?.customerEmail || '—')} />
              <Row label="Phone" value={(booking?.customer?.phone || (booking as any)?.customerContact || '—')} />
            <Row label="Address" value={(booking?.customer?.address || '—')} />
          </div>
          <div className="mt-3">
            <p className="text-sm text-gray-600">Customer note</p>
            <p className="text-sm text-gray-900">{booking?.note || booking?.message || '—'}</p>
          </div>
        </Card>

        {/* Event Details */}
        <Card title="Event Details">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Row label="Hall" value={(booking?.hall?.name || booking?.hallName || '—')} />
            <Row label="Event date & time" value={eventDateTime} />
            <Row label="Guests" value={String(booking?.guests ?? booking?.hall?.capacity ?? '—')} />
            <Row label="Event type" value={(booking?.eventType || '—')} />
          </div>
          <div className="mt-3">
            <p className="text-sm text-gray-600">Requirements</p>
            <p className="text-sm text-gray-900">{booking?.requirements || booking?.specialRequirements || '—'}</p>
          </div>
        </Card>

        {/* Payment Details */}
        <Card title="Payment Details">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Row label="Amount" value={(booking?.amountToOwner || booking?.grossAmount) ? `₹${booking?.amountToOwner || booking?.grossAmount}` : '—'} />
            <Row label="Payment status" value={(booking?.paymentStatus || 'pending')} />
            <Row label="Payment ID" value={(booking?.paymentId || booking?.transactionId || '—')} />
            <Row label="Mode" value={(booking?.paymentMode || booking?.mode || '—')} />
          </div>
        </Card>

        {/* Action Bar */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 flex flex-wrap gap-2">
          <button onClick={onApprove} className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700">Approve booking</button>
          <button onClick={onReject} className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700">Reject booking</button>
          <a href="/dashboard" className="ml-auto text-sm text-blue-700 hover:underline">Back to Dashboard</a>
        </div>
      </div>
    </div>
  );
}