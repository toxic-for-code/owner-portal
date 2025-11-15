import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import mongoose from 'mongoose';
import { connectDb } from '../../../../lib/db';
import { authOptions } from '../../../../lib/auth';
import Booking from '../../../../models/Booking';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ message: 'Method not allowed' });
  try {
    const session = await getServerSession(req, res, authOptions);
    if (!session || !session.user || (session.user as any).role !== 'owner' || (session.user as any).status !== 'active') {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const { id } = req.query;
    if (!id || typeof id !== 'string' || !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid booking id' });
    }

    if (mongoose.connection.readyState === 0) {
      await connectDb();
    }

    const { remark } = req.body || {};

    const ownerIdStr = (session.user as any).id as string;
    let ownerObjectIdFilter: any = null;
    try {
      ownerObjectIdFilter = { ownerId: new mongoose.Types.ObjectId(ownerIdStr) };
    } catch (e) {
      ownerObjectIdFilter = null;
    }

    const filter: any = {
      _id: new mongoose.Types.ObjectId(id),
      ...(ownerObjectIdFilter
        ? { $or: [ownerObjectIdFilter, { ownerId: ownerIdStr }] }
        : { ownerId: ownerIdStr }),
    };

    const set: any = {
      status: 'declined',
      decisionAt: new Date(),
    };
    if (typeof remark === 'string' && remark.trim().length > 0) {
      set.ownerDecisionRemark = remark.trim();
    }

    const updated = await Booking.findOneAndUpdate(filter, { $set: set }, { new: true, runValidators: false });
    if (!updated) return res.status(404).json({ message: 'Booking not found or not owned by you' });
    return res.status(200).json({ message: 'Booking declined', bookingId: updated._id.toString(), status: updated.status });
  } catch (error) {
    console.error('Error declining booking:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}