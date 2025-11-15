import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import mongoose from 'mongoose';
import { connectDb } from '../../../../lib/db';
import { authOptions } from '../../../../lib/auth';
import Booking from '../../../../models/Booking';
import User from '../../../../models/User';
import Hall from '../../../../models/Hall';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);
  if (!session || !session.user || (session.user as any).role !== 'owner' || (session.user as any).status !== 'active') {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  if (mongoose.connection.readyState === 0) {
    await connectDb();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { id } = req.query as { id: string };
  if (!id) return res.status(400).json({ message: 'Missing id' });

  let oid: any = null;
  try { oid = new mongoose.Types.ObjectId(id); } catch {}
  const booking = await Booking.findById(oid || id).lean();
  if (!booking) return res.status(404).json({ message: 'Not found' });

  // Owner authorization: only allow the owner of the hall/booking
  const ownerId = (session.user as any).id;
  const bookingOwnerId = booking.ownerId?.toString?.() ?? booking.ownerId;
  if (String(bookingOwnerId) !== String(ownerId)) {
    return res.status(403).json({ message: 'Forbidden' });
  }

  // Enrich customer from users collection
  const uid = booking.userId?.toString?.() ?? (booking as any).userId;
  let user: any = null;
  if (uid) {
    try {
      const u = await User.findById(uid).select('name phone email image').lean();
      user = u || null;
    } catch {}
  }
  if (!user && booking.customerContact) {
    user = await User.findOne({ phone: booking.customerContact }).select('name phone email image').lean();
  }

  // Enrich hall
  const hid = booking.hallId?.toString?.() ?? booking.hallId;
  let hall: any = null;
  try {
    const h = await Hall.findById(hid).select('name price').lean();
    hall = h ? { id: h._id.toString(), name: h.name, price: h.price } : null;
  } catch {}

  const mapped = {
    ...booking,
    _id: booking._id?.toString?.() ?? booking._id,
    ownerId: booking.ownerId?.toString?.() ?? booking.ownerId,
    hallId: booking.hallId?.toString?.() ?? booking.hallId,
    userId: uid || null,
    customer: user
      ? { id: uid || user._id?.toString?.(), name: user.name, phone: user.phone || null, email: user.email || null, image: user.image || null }
      : { id: uid || null, name: booking.customerName || null, phone: booking.customerContact || null, email: null, image: null },
    hall,
  };

  return res.status(200).json({ booking: mapped });
}