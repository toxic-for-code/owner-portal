import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import mongoose from 'mongoose';
import { connectDb } from '../../../../lib/db';
import { authOptions } from '../../../../lib/auth';
import Booking from '../../../../models/Booking';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ message: 'Method not allowed' });
  const session = await getServerSession(req, res, authOptions);
  if (!session || !session.user || (session.user as any).role !== 'owner' || (session.user as any).status !== 'active') {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  if (mongoose.connection.readyState === 0) {
  await connectDb();
  }
  const { id } = req.query;
  const { remark } = req.body || {};
  const booking = await Booking.findById(id);
  if (!booking) return res.status(404).json({ message: 'Booking not found' });
  if (booking.ownerId.toString() !== (session.user as any).id) return res.status(403).json({ message: 'Forbidden' });
  booking.status = 'declined';
  if (typeof remark === 'string' && remark.trim().length > 0) {
    booking.ownerDecisionRemark = remark.trim();
  }
  booking.decisionAt = new Date();
  await booking.save();
  return res.status(200).json({ message: 'Booking declined' });
}