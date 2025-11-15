import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../../lib/auth';
import mongoose from 'mongoose';
import { connectDb } from '../../../lib/db';
import User from '../../../models/User';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') return res.status(405).json({ message: 'Method not allowed' });
  const session = await getServerSession(req, res, authOptions);
  if (!session || !session.user?.email) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  try {
    if (mongoose.connection.readyState === 0) {
      await connectDb();
    }
    const user = await User.findOne({ email: session.user.email }).select('subscriptionPlan role').lean();
    if (!user) return res.status(404).json({ message: 'User not found' });
    return res.status(200).json({ subscriptionPlan: user.subscriptionPlan || 'basic', role: user.role });
  } catch (e: any) {
    return res.status(500).json({ message: 'Server error', error: e?.message || String(e) });
  }
}