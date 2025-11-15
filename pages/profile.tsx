import { useSession, signOut } from 'next-auth/react';
import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/router';
import BookingApprovalCard from '../components/BookingApprovalCard';

export default function Profile() {
  const { data: session, status, update } = useSession();
  const router = useRouter();
  const [halls, setHalls] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [bookings, setBookings] = useState<any[]>([]);
  const [bookingsLoading, setBookingsLoading] = useState(true);
  const [remarks, setRemarks] = useState<Record<string, string>>({});
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const profileBtnRef = useRef<HTMLDivElement>(null);
  const [editingPhone, setEditingPhone] = useState(false);
  const [phone, setPhone] = useState((session?.user as any)?.phone || '');
  const [phoneLoading, setPhoneLoading] = useState(false);
  const [phoneSuccess, setPhoneSuccess] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [image, setImage] = useState((session?.user as any)?.image || '');
  const [imageUploading, setImageUploading] = useState(false);
  const [imageError, setImageError] = useState('');

  useEffect(() => {
    if (status === 'loading') return;
    if (!session || (session.user as any).role !== 'owner' || (session.user as any).status !== 'active') {
      router.replace('/signin');
      return;
    }
    const fetchHalls = async () => {
      setLoading(true);
      const res = await fetch('/api/halls?owner=me');
      if (res.ok) {
        const data = await res.json();
        setHalls(data.halls || []);
      }
      setLoading(false);
    };
    const fetchBookings = async () => {
      setBookingsLoading(true);
      const res = await fetch('/api/bookings?owner=me');
      if (res.ok) {
        const data = await res.json();
        setBookings(data.bookings || []);
      }
      setBookingsLoading(false);
    };
    fetchHalls();
    fetchBookings();
  }, [session, status, router]);

  // Sync image state with session.user.image after refresh or session change
  useEffect(() => {
    setImage((session?.user as any)?.image || '');
  }, [session?.user?.image]);

  const handlePhoneSave = async () => {
    setPhoneLoading(true);
    setPhoneSuccess('');
    setPhoneError('');
    try {
      const res = await fetch('/api/auth/update-profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone }),
      });
      if (!res.ok) {
        const data = await res.json();
        setPhoneError(data.message || 'Failed to update phone');
      } else {
        setPhoneSuccess('Phone updated!');
        setEditingPhone(false);
        if (update) await update();
      }
    } catch (err) {
      setPhoneError('Failed to update phone');
    } finally {
      setPhoneLoading(false);
    }
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append('file', file);
    setImageUploading(true);
    setImageError('');
    try {
      const uploadRes = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      const uploadData = await uploadRes.json();
      if (!uploadRes.ok || !uploadData.urls || !uploadData.urls[0]) {
        setImageError('Upload failed');
        setImageUploading(false);
        return;
      }
      const imageUrl = uploadData.urls[0];
      // Update user profile image on server
      const updateRes = await fetch('/api/auth/update-profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: imageUrl }),
      });
      if (!updateRes.ok) {
        setImageError('Failed to update profile photo');
        setImageUploading(false);
        return;
      }
      setImage(imageUrl);
      if (update) await update();
    } catch (err) {
      setImageError('Upload failed');
    } finally {
      setImageUploading(false);
    }
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8f9fa]">
        <div className="text-lg font-semibold text-blue-700">Loading...</div>
      </div>
    );
  }

  if (!session) return null;

  return (
    <div className="min-h-screen bg-[#f8f9fa]">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 w-full bg-white shadow z-20">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <button
            type="button"
            onClick={() => router.push('/')}
            className="flex items-center gap-2 cursor-pointer focus:outline-none"
            aria-label="Go to Home"
          >
            <img src="/logo.png" alt="WeEnYou Logo" width={36} height={36} className="h-9 w-9 object-contain" />
            <span className="text-lg sm:text-xl font-bold tracking-tight text-blue-700">WeEnYou Hall Owner Portal</span>
          </button>
          <div ref={profileBtnRef} className="ml-auto relative">
            <button
              onClick={() => setDropdownOpen((v) => !v)}
              className="flex items-center gap-2 border border-gray-200 rounded-full px-6 py-2 bg-white hover:shadow transition cursor-pointer focus:outline-none"
            >
              <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5.121 17.804A9 9 0 1112 21a8.963 8.963 0 01-6.879-3.196z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
              <span className="font-semibold text-lg text-gray-700">Welcome, {session.user?.name || 'User'}</span>
            </button>
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-lg shadow-lg z-30">
                <button
                  onClick={() => { setDropdownOpen(false); signOut(); }}
                  className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
                >
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>
      <main className="pt-24 max-w-5xl mx-auto px-4 pb-10">
        <div className="bg-white/60 backdrop-blur-md rounded-2xl shadow-xl p-8 border border-white/40 mb-8">
          <h1 className="text-2xl font-bold mb-2 text-blue-900">Owner Profile</h1>
          <div className="flex items-center gap-6 mb-6">
            <div className="relative">
              <img
                src={image || '/logo.png'}
                alt="Profile Photo"
                className="w-20 h-20 rounded-full object-cover border border-gray-200 shadow-sm bg-white"
              />
              <label className="absolute bottom-0 right-0 bg-blue-600 text-white rounded-full p-1 cursor-pointer hover:bg-blue-700 transition" style={{fontSize: 0}}>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageChange}
                  disabled={imageUploading}
                />
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536M9 13h6m2 2v6a2 2 0 01-2 2H7a2 2 0 01-2-2v-6a2 2 0 012-2h2l2-2 2 2h2a2 2 0 012 2z" /></svg>
              </label>
              {imageUploading && <div className="absolute inset-0 bg-white bg-opacity-60 flex items-center justify-center rounded-full"><span className="text-xs text-blue-700">Uploading...</span></div>}
            </div>
            {imageError && <span className="text-red-600 text-xs ml-2">{imageError}</span>}
          </div>
          <div className="text-gray-700 mb-1"><span className="font-semibold">Name:</span> {session.user?.name || '—'}</div>
          <div className="text-gray-700 mb-1"><span className="font-semibold">Email:</span> {session.user?.email || '—'}</div>
          <div className="text-gray-700 mb-1 flex items-center gap-2">
            <span className="font-semibold">Phone:</span>
            {editingPhone ? (
              <>
                <input
                  type="tel"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  className="border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={phoneLoading}
                />
                <button
                  onClick={handlePhoneSave}
                  className="bg-blue-600 text-white px-2 py-1 rounded text-xs font-semibold hover:bg-blue-700 transition"
                  disabled={phoneLoading}
                >
                  {phoneLoading ? 'Saving...' : 'Save'}
                </button>
                <button
                  onClick={() => { setEditingPhone(false); setPhone((session?.user as any)?.phone || ''); }}
                  className="text-gray-500 text-xs ml-1"
                  disabled={phoneLoading}
                >
                  Cancel
                </button>
              </>
            ) : (
              <>
                <span>{(session.user as any)?.phone || '—'}</span>
                <button
                  onClick={() => setEditingPhone(true)}
                  className="text-blue-600 text-xs underline ml-2"
                >
                  {((session.user as any)?.phone) ? 'Edit' : 'Add'}
                </button>
              </>
            )}
            {phoneSuccess && <span className="text-green-600 text-xs ml-2">{phoneSuccess}</span>}
            {phoneError && <span className="text-red-600 text-xs ml-2">{phoneError}</span>}
          </div>
          <div className="text-gray-700 mb-1"><span className="font-semibold">Role:</span> {(session.user as any)?.role || '—'}</div>
          <div className="text-gray-700 mb-1"><span className="font-semibold">Status:</span> {(session.user as any)?.status || '—'}</div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white/60 backdrop-blur-md rounded-2xl shadow-xl p-8 border border-white/40">
          <h2 className="text-xl font-bold mb-4 text-blue-900">Your Halls</h2>
          {halls.length === 0 ? (
            <div className="text-gray-500 text-center">You have not listed any halls yet.</div>
          ) : (
            <div className="space-y-6">
              {halls.map(hall => {
                let statusBadge;
                if (hall.status === 'inactive' && !hall.verified) {
                  statusBadge = <span className="text-xs font-bold px-2 py-1 rounded bg-red-100 text-red-800">Rejected</span>;
                } else {
                  statusBadge = <span className={`text-xs font-bold px-2 py-1 rounded ${hall.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : hall.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-200 text-gray-700'}`}>{hall.status}</span>;
                }
                return (
                  <div key={hall._id} className="flex flex-col md:flex-row md:items-center gap-4 bg-blue-50 rounded-xl p-4 shadow-sm">
                    <div className="flex-shrink-0 w-28 h-20 bg-gray-200 rounded-lg overflow-hidden flex items-center justify-center">
                      {hall.images && hall.images.length > 0 ? (
                        <img src={hall.images[0]} alt={hall.name} className="object-cover w-full h-full" />
                      ) : (
                        <span className="text-gray-400">No Image</span>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <span className="text-lg font-semibold text-blue-800">{hall.name}</span>
                        {statusBadge}
                        {hall.verified ? (
                          <span className="text-xs font-bold px-2 py-1 rounded bg-green-100 text-green-800">Verified</span>
                        ) : (
                          <span className="text-xs font-bold px-2 py-1 rounded bg-gray-100 text-gray-600">Not Verified</span>
                        )}
                        {hall.featured ? (
                          <span className="text-xs font-bold px-2 py-1 rounded bg-purple-100 text-purple-800">Featured</span>
                        ) : (
                          <span className="text-xs font-bold px-2 py-1 rounded bg-gray-100 text-gray-600">Not Featured</span>
                        )}
                      </div>
                      <div className="text-gray-700 mb-1"><span className="font-semibold">Price:</span> ₹{hall.price} &nbsp; <span className="font-semibold">Capacity:</span> {hall.capacity}</div>
                      <div className="text-gray-700 mb-1"><span className="font-semibold">Amenities:</span> {hall.amenities && hall.amenities.length > 0 ? hall.amenities.join(', ') : '—'}</div>
                      <div className="text-gray-700 mb-1"><span className="font-semibold">Location:</span> {hall.location?.address}, {hall.location?.city}, {hall.location?.state} {hall.location?.pincode}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
        {/* Booking Requests Section */}
        <div className="bg-white/60 backdrop-blur-md rounded-2xl shadow-xl p-8 border border-white/40">
          <h2 className="text-xl font-bold mb-4 text-blue-900">Booking Requests</h2>
          {bookingsLoading ? (
            <div className="text-blue-700">Loading bookings...</div>
          ) : bookings.length === 0 ? (
            <div className="text-gray-500 text-center">No bookings yet.</div>
          ) : (
            <div className="space-y-6">
              {bookings.map((b) => {
                // Map raw DB fields to UI with sensible fallbacks
                const eventStart = b.startDate ? new Date(b.startDate) : (b.eventDateTime ? new Date(b.eventDateTime) : null);
                const eventEnd = b.endDate ? new Date(b.endDate) : null;
                const eventText = eventStart
                  ? (eventEnd ? `${eventStart.toLocaleString()} → ${eventEnd.toLocaleString()}` : eventStart.toLocaleString())
                  : '—';
                const hallName = (b.hall && b.hall.name) || b.hallName || (b.hallId ? `Hall ${b.hallId}` : '—');
                const paymentStatus = b.paymentStatus || '—';
                const paymentStatusLower = (paymentStatus || '').toString().toLowerCase();
                const amountToOwnerDisplay = typeof b?.hall?.price === 'number'
                  ? b.hall.price
                  : (typeof b.totalPrice === 'number' ? b.totalPrice : (typeof b.amountToOwner === 'number' ? b.amountToOwner : 0));
                const advancePaid = typeof b.advanceAmountPaid === 'number'
                  ? b.advanceAmountPaid
                  : (typeof b.amountPaidToOwner === 'number' ? b.amountPaidToOwner : (typeof b.ownerPaidAmount === 'number' ? b.ownerPaidAmount : 0));
                const due = Math.max(0, Math.round(((amountToOwnerDisplay ?? 0) - (advancePaid ?? 0)) * 100) / 100);
                const managerAssigned = b.managerAssigned ?? false;
                const manager = managerAssigned ? (b.manager || null) : null;
                const customerName = (b.customer && b.customer.name) || b.customerName || b.userId || '—';
                const customerPhone = (b.customer && b.customer.phone) || b.customerContact || '';
                const statusText = b.status || '—';
                const statusLower = (statusText || '').toString().toLowerCase();
                const statusClass = statusLower.includes('pending')
                  ? 'bg-yellow-100 text-yellow-800'
                  : (statusLower.includes('approved') || statusLower.includes('confirm'))
                    ? 'bg-green-100 text-green-800'
                    : (statusLower.includes('declined') || statusLower.includes('reject') || statusLower.includes('cancel'))
                      ? 'bg-red-100 text-red-800'
                      : 'bg-gray-100 text-gray-800';
                const bookingId = b.id || b._id;
                return (
                  <BookingApprovalCard
                    key={bookingId}
                    bookingId={String(bookingId)}
                    statusText={statusText}
                    statusClass={statusClass}
                    eventText={eventText}
                    hallName={hallName}
                    customerName={customerName}
                    customerPhone={customerPhone}
                    paymentStatus={paymentStatus}
                    amountToOwner={Number(amountToOwnerDisplay) || 0}
                    advancePaid={Number(advancePaid) || 0}
                    dueAmount={Number(due) || 0}
                    managerText={manager ? `${manager?.name}${manager?.contact ? ` (${manager.contact})` : ''}` : undefined}
                    remark={remarks[bookingId] || ''}
                    onRemarkChange={(val) => setRemarks(prev => ({ ...prev, [bookingId]: val }))}
                    onApprove={statusLower.includes('pending') ? async () => { await fetch(`/api/bookings/${bookingId}/approve`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ remark: remarks[bookingId] || '' }) }); const res = await fetch('/api/bookings?owner=me'); if (res.ok) { const data = await res.json(); setBookings(data.bookings || []); } } : undefined}
                    onDecline={statusLower.includes('pending') ? async () => { await fetch(`/api/bookings/${bookingId}/decline`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ remark: remarks[bookingId] || '' }) }); const res = await fetch('/api/bookings?owner=me'); if (res.ok) { const data = await res.json(); setBookings(data.bookings || []); } } : undefined}
                    showActions={statusLower.includes('pending')}
                  />
                );
              })}
            </div>
          )}
        </div>
        </div>
      </main>
    </div>
  );
}