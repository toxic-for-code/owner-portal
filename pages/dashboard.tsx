import React, { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import BookingDetailsDrawer from '../components/BookingDetailsDrawer';

type Hall = any;
type Booking = any;

function StatBadge({ label, value, color = 'bg-blue-100 text-blue-800' }: { label: string; value: number; color?: string }) {
  return (
    <div className="flex items-center justify-between rounded-lg bg-white shadow-sm border border-gray-200 p-3">
      <span className="text-sm text-gray-600">{label}</span>
      <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${color}`}>{value}</span>
    </div>
  );
}

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [halls, setHalls] = useState<Hall[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [bookingsLoading, setBookingsLoading] = useState(true);
  const [requestsOpen, setRequestsOpen] = useState(true);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<any>(null);

  useEffect(() => {
    if (status === 'loading') return;
    if (!session || (session.user as any)?.role !== 'owner' || (session.user as any)?.status !== 'active') {
      router.replace('/signin');
      return;
    }

    const fetchHalls = async () => {
      try {
        const res = await fetch('/api/halls?owner=me');
        if (res.ok) {
          const data = await res.json();
          setHalls(data.halls || []);
        }
      } catch {}
      setLoading(false);
    };

    const fetchBookings = async () => {
      setBookingsLoading(true);
      try {
        const res = await fetch('/api/bookings?owner=me');
        if (res.ok) {
          const data = await res.json();
          setBookings(data.bookings || []);
        }
      } catch {}
      setBookingsLoading(false);
    };

    fetchHalls();
    fetchBookings();
  }, [status, session, router]);

  const stats = useMemo(() => {
    const approved = bookings.filter((b: any) => (b.status || '').toLowerCase() === 'approved').length;
    const pending = bookings.filter((b: any) => (b.status || '').toLowerCase() === 'pending').length;
    const declined = bookings.filter((b: any) => (b.status || '').toLowerCase() === 'declined').length;
    const now = Date.now();
    const upcoming = bookings.filter((b: any) => {
      const d = new Date(b.eventDateTime || b.eventDate || b.createdAt || Date.now()).getTime();
      return d > now && ['approved', 'pending'].includes((b.status || '').toLowerCase());
    }).length;
    return { approved, pending, declined, upcoming };
  }, [bookings]);

  const [page, setPage] = useState(1);
  const pageSize = 5;
  const totalPages = Math.max(1, Math.ceil(bookings.length / pageSize));
  const pageBookings = bookings.slice((page - 1) * pageSize, page * pageSize);

  const onApprove = async (id: string) => {
    try {
      const res = await fetch(`/api/bookings/${id}/approve`, { method: 'POST', headers: { 'Content-Type': 'application/json' } });
      if (res.ok) {
        setBookings((prev) => prev.map((b: any) => (String(b.id || b._id) === String(id) ? { ...b, status: 'approved' } : b)));
      }
    } catch {}
  };
  const onDecline = async (id: string) => {
    try {
      const res = await fetch(`/api/bookings/${id}/decline`, { method: 'POST', headers: { 'Content-Type': 'application/json' } });
      if (res.ok) {
        setBookings((prev) => prev.map((b: any) => (String(b.id || b._id) === String(id) ? { ...b, status: 'declined' } : b)));
      }
    } catch {}
  };

  const accent = 'text-blue-700';

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navbar */}
      <div className="sticky top-0 z-10 bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Image src="/logo.png" width={32} height={32} alt="logo" className="rounded" />
            <span className="font-semibold text-gray-900">WeEnYou Hall Owner Portal</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden">
              {session?.user?.image ? (
                <Image src={session.user.image} alt="avatar" width={32} height={32} />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-600 font-semibold">
                  {(session?.user?.name || 'S')[0]}
                </div>
              )}
            </div>
            <span className="text-sm text-gray-700">Welcome, {(session?.user as any)?.name || 'Owner'}</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Top 3-column grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Owner Profile Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-16 h-16 rounded-full bg-gray-200 overflow-hidden">
                  {session?.user?.image ? (
                    <Image src={session.user.image} alt="avatar" width={64} height={64} />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-600 text-xl font-semibold">
                      {(session?.user?.name || 'S')[0]}
                    </div>
                  )}
                </div>
                <button className="absolute bottom-0 right-0 w-6 h-6 rounded-full bg-blue-600 text-white text-xs grid place-items-center shadow">✎</button>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-900 truncate">{(session?.user as any)?.name || '—'}</p>
                <p className="text-sm text-gray-600 truncate">{session?.user?.email || '—'}</p>
                <p className="text-sm text-gray-600 truncate">{(session?.user as any)?.phone || '—'}</p>
                <div className="mt-2 flex gap-2">
                  <span className="px-2 py-0.5 text-xs rounded-full bg-blue-100 text-blue-800">{(session?.user as any)?.role || 'owner'}</span>
                  <span className="px-2 py-0.5 text-xs rounded-full bg-green-100 text-green-800">{(session?.user as any)?.status || 'active'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Your Halls */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
            <div className="flex items-center justify-between mb-3">
              <h2 className={`text-sm font-semibold ${accent}`}>Your Halls</h2>
              <span className="text-xs text-gray-500">{halls.length} halls</span>
            </div>
            <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1">
              {loading && <p className="text-sm text-gray-500">Loading halls…</p>}
              {!loading && halls.length === 0 && <p className="text-sm text-gray-500">No halls yet.</p>}
              {halls.map((h: any) => (
                <div key={String(h._id || h.id)} className="p-3 rounded-lg border border-gray-200 shadow-sm bg-white">
                  <div className="flex items-center justify-between">
                    <p className="font-medium text-gray-900 truncate">{h.name}</p>
                    <div className="flex gap-2">
                      {h.verified && <span className="px-2 py-0.5 text-xs rounded-full bg-green-100 text-green-800">verified</span>}
                      <span className={`px-2 py-0.5 text-xs rounded-full ${h.status === 'active' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-700'}`}>{h.status || 'pending'}</span>
                    </div>
                  </div>
                  <div className="mt-1 text-sm text-gray-700 flex gap-4">
                    <span>₹{h.price}</span>
                    <span>Capacity: {h.capacity}</span>
                  </div>
                  <p className="mt-1 text-xs text-gray-500 truncate">{Array.isArray(h.amenities) ? h.amenities.join(', ') : ''}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Booking Summary */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
            <h2 className={`text-sm font-semibold mb-3 ${accent}`}>Booking Summary</h2>
            <div className="space-y-3">
              <StatBadge label="Approved bookings" value={stats.approved} color="bg-green-100 text-green-800" />
              <StatBadge label="Pending bookings" value={stats.pending} color="bg-yellow-100 text-yellow-800" />
              <StatBadge label="Rejected bookings" value={stats.declined} color="bg-red-100 text-red-800" />
              <StatBadge label="Upcoming events" value={stats.upcoming} color="bg-blue-100 text-blue-800" />
            </div>
          </div>
        </div>

        {/* Bottom section - Booking Requests */}
        <div className="mt-6 bg-white rounded-xl shadow-sm border border-gray-100">
          <button className="w-full flex items-center justify-between px-4 py-3" onClick={() => setRequestsOpen((o) => !o)}>
            <span className="text-sm font-semibold text-gray-900">Booking Requests</span>
            <span className="text-gray-500">{requestsOpen ? '▼' : '▲'}</span>
          </button>
          {requestsOpen && (
            <div className="px-4 pb-4">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left border-b border-gray-200">
                      <th className="py-2 px-3 text-gray-600">Booking ID</th>
                      <th className="py-2 px-3 text-gray-600">Customer Name</th>
                      <th className="py-2 px-3 text-gray-600">Hall Name</th>
                      <th className="py-2 px-3 text-gray-600">Event Date & Time</th>
                      <th className="py-2 px-3 text-gray-600">Guests</th>
                      <th className="py-2 px-3 text-gray-600">Status</th>
                      <th className="py-2 px-3 text-gray-600">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bookingsLoading && (
                      <tr>
                        <td colSpan={7} className="py-4 px-3 text-center text-gray-500">Loading…</td>
                      </tr>
                    )}
                    {!bookingsLoading && pageBookings.length === 0 && (
                      <tr>
                        <td colSpan={7} className="py-4 px-3 text-center text-gray-500">No requests</td>
                      </tr>
                    )}
                    {!bookingsLoading && pageBookings.map((b: any) => {
                      const bookingId = String(b.id || b._id);
                      const customerName = (b.customer && b.customer.name) || b.customerName || '—';
                      const hallName = b.hall?.name || b.hallName || '—';
                      const dateStr = (() => {
                        const dt = b.eventDateTime || b.startDate || b.eventDate || null;
                        const end = b.endDate || null;
                        if (dt && end) {
                          const s = new Date(dt);
                          const e = new Date(end);
                          const sameDay = s.toDateString() === e.toDateString();
                          return sameDay
                            ? `${s.toLocaleDateString()} ${s.toLocaleTimeString()} – ${e.toLocaleTimeString()}`
                            : `${s.toLocaleDateString()} – ${e.toLocaleDateString()}`;
                        }
                        if (dt) return new Date(dt).toLocaleString();
                        if (b.createdAt) return new Date(b.createdAt).toLocaleDateString();
                        return '—';
                      })();
                      const guests = (b.guests ?? b.guestCount ?? b.numberOfGuests ?? b.hall?.capacity ?? '—');
                      const status = (b.status || 'pending').toLowerCase();
                      const statusColor = status === 'approved' ? 'bg-green-100 text-green-800' : status === 'declined' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800';
                      const canAct = !['approved', 'declined', 'confirmed'].includes(status);
                      return (
                        <tr key={bookingId} className="border-b border-gray-100">
                          <td className="py-2 px-3 text-gray-900">#{bookingId}</td>
                          <td className="py-2 px-3 text-gray-700">{customerName}</td>
                          <td className="py-2 px-3 text-gray-700">{hallName}</td>
                          <td className="py-2 px-3 text-gray-700">{dateStr}</td>
                          <td className="py-2 px-3 text-gray-700">{guests}</td>
                          <td className="py-2 px-3"><span className={`px-2 py-0.5 rounded-full text-xs ${statusColor}`}>{status}</span></td>
                          <td className="py-2 px-3">
                            <div className="flex gap-2">
                              <button onClick={() => { setSelectedBooking(b); setDrawerOpen(true); }} className="px-3 py-1 text-xs rounded-full bg-blue-600 text-white shadow-sm">View</button>
                              {canAct && (
                                <>
                                  <button onClick={() => onApprove(bookingId)} className="px-3 py-1 text-xs rounded-full bg-green-600 text-white shadow-sm">Approve</button>
                                  <button onClick={() => onDecline(bookingId)} className="px-3 py-1 text-xs rounded-full bg-red-600 text-white shadow-sm">Reject</button>
                                </>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="mt-3 flex items-center justify-end gap-2">
                <button disabled={page <= 1} onClick={() => setPage((p) => Math.max(1, p - 1))} className="px-3 py-1 text-xs rounded border border-gray-300 bg-white disabled:opacity-50">Prev</button>
                <span className="text-xs text-gray-600">Page {page} of {totalPages}</span>
                <button disabled={page >= totalPages} onClick={() => setPage((p) => Math.min(totalPages, p + 1))} className="px-3 py-1 text-xs rounded border border-gray-300 bg-white disabled:opacity-50">Next</button>
              </div>
            </div>
          )}
        </div>
      </div>
      {drawerOpen && (
        <BookingDetailsDrawer
          open={drawerOpen}
          booking={selectedBooking}
          onClose={() => setDrawerOpen(false)}
          onApprove={(id: string) => onApprove(id)}
          onReject={(id: string) => onDecline(id)}
        />
      )}
    </div>
  );
}