import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import mongoose from 'mongoose';
import { connectDb } from '../../../lib/db';
import { authOptions } from '../../../lib/auth';
import Booking from '../../../models/Booking';
import User from '../../../models/User';
import Hall from '../../../models/Hall';

function parseCommission(): number {
  const raw = process.env.COMMISSION_PERCENT ?? '5';
  const n = Number(raw);
  if (Number.isNaN(n)) return 5; // default 5%
  return n > 1 ? n / 100 : n; // support "5" or "0.05"
}

function computeAmounts(grossAmount: number) {
  const pct = parseCommission();
  const commissionAmount = grossAmount * pct;
  const amountToOwner = grossAmount - commissionAmount;
  const round2 = (v: number) => Math.round(v * 100) / 100;
  return {
    commissionPercent: pct,
    commissionAmount: round2(commissionAmount),
    amountToOwner: round2(amountToOwner),
  };
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);
  if (!session || !session.user || (session.user as any).role !== 'owner' || (session.user as any).status !== 'active') {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  if (mongoose.connection.readyState === 0) {
  await connectDb();
  }

  if (req.method === 'GET') {
    if (req.query.owner === 'me') {
      const ownerId = (session.user as any).id;
      // Be defensive: support both ObjectId and string-stored ownerId to avoid data mismatches
      let ownerObjectIdFilter: any = null;
      try {
        ownerObjectIdFilter = { ownerId: new mongoose.Types.ObjectId(ownerId) };
      } catch (e) {
        ownerObjectIdFilter = null;
      }
      const query: any = ownerObjectIdFilter
        ? { $or: [ownerObjectIdFilter, { ownerId }] }
        : { ownerId };
      // Return raw booking documents from the bookings collection
      // Use lean() to get plain objects and include all existing fields
      const bookings = await Booking.find(query).sort({ createdAt: -1 }).lean();
      // Lookup customer details when userId is present
      const userIds: string[] = bookings
        .map((b: any) => b.userId?.toString?.() ?? b.userId)
        .filter((id: any) => typeof id === 'string');
      const uniqueUserIds = Array.from(new Set(userIds));
      let usersMap: Record<string, any> = {};
      if (uniqueUserIds.length > 0) {
        const ids = uniqueUserIds
          .map(id => {
            try { return new mongoose.Types.ObjectId(id); } catch { return null; }
          })
          .filter(Boolean) as mongoose.Types.ObjectId[];
        const users = await User.find({ _id: { $in: ids } }).select('name phone email image').lean();
        usersMap = users.reduce((acc: Record<string, any>, u: any) => {
          acc[u._id.toString()] = u;
          return acc;
        }, {});
      }
      // Lookup hall details (name, price) for display
      const hallIds = bookings
        .map((b: any) => b.hallId?.toString?.() ?? b.hallId)
        .filter((id: any) => typeof id === 'string');
      const uniqueHallIds = Array.from(new Set(hallIds));
      let hallsMap: Record<string, any> = {};
      if (uniqueHallIds.length > 0) {
        const hids = uniqueHallIds
          .map(id => {
            try { return new mongoose.Types.ObjectId(id); } catch { return null; }
          })
          .filter(Boolean) as mongoose.Types.ObjectId[];
        const halls = await Hall.find({ _id: { $in: hids } }).select('name price').lean();
        hallsMap = halls.reduce((acc: Record<string, any>, h: any) => {
          acc[h._id.toString()] = { id: h._id.toString(), name: h.name, price: h.price };
          return acc;
        }, {});
      }
      const mapped = bookings.map((b: any) => ({
        // Normalize _id to string while preserving all other fields
        ...b,
        _id: b._id?.toString?.() ?? b._id,
        ownerId: b.ownerId?.toString?.() ?? b.ownerId,
        hallId: b.hallId?.toString?.() ?? b.hallId,
        userId: b.userId?.toString?.() ?? b.userId,
        // Customer enrichment: prefer user record; fallback to stored customer fields
        customer: (() => {
          const uid = b.userId?.toString?.() ?? b.userId;
          const user = uid ? usersMap[uid] : null;
          if (user) {
            return {
              id: uid,
              name: user.name,
              phone: user.phone || null,
              email: user.email || null,
              image: user.image || null,
            };
          }
          return {
            id: uid || null,
            name: b.customerName || null,
            phone: b.customerContact || null,
            email: null,
            image: null,
          };
        })(),
        hall: (() => {
          const hid = b.hallId?.toString?.() ?? b.hallId;
          return hid ? (hallsMap[hid] || null) : null;
        })(),
      }));
      return res.status(200).json({ bookings: mapped });
    }
    return res.status(400).json({ message: 'Invalid query' });
  }

  if (req.method === 'POST') {
    // Create a booking (e.g., triggered by customer app). Owner assignment is derived from hall
    const { hallId, eventDateTime, customerName, customerContact, grossAmount } = req.body;
    if (!hallId || !eventDateTime || !customerName || typeof grossAmount !== 'number') {
      return res.status(400).json({ message: 'Missing or invalid fields' });
    }
    const hall = await Hall.findById(hallId);
    if (!hall) return res.status(404).json({ message: 'Hall not found' });

    const { commissionPercent, commissionAmount, amountToOwner } = computeAmounts(grossAmount);
    const booking = await Booking.create({
      hallId: hall._id,
      ownerId: hall.ownerId,
      eventDateTime: new Date(eventDateTime),
      customerName,
      customerContact,
      grossAmount,
      commissionPercent,
      commissionAmount,
      amountToOwner,
      ownerPaidAmount: 0,
      paymentStatus: 'unpaid',
      managerAssigned: false,
      status: 'pending',
    });
    // Return minimal booking info (not owner-safe since this is generic)
    return res.status(201).json({ bookingId: booking._id.toString(), message: 'Booking created' });
  }

  return res.status(405).json({ message: 'Method not allowed' });
}