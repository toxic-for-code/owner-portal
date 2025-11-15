import { getServerSession } from 'next-auth';
import { authOptions } from '../../../lib/auth';
import User from '../../../models/User';
import mongoose from 'mongoose';
import { connectDb } from '../../../lib/db';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }
  const session = await getServerSession(req, res, authOptions);
  if (!session || !session.user?.email) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  const { phone, image } = req.body;
  if (phone && typeof phone !== 'string') {
    return res.status(400).json({ message: 'Invalid phone' });
  }
  if (image && typeof image !== 'string') {
    return res.status(400).json({ message: 'Invalid image' });
  }
  try {
    if (mongoose.connection.readyState === 0) {
  await connectDb();
    }
    const updateFields: any = {};
    if (phone !== undefined) updateFields.phone = phone;
    if (image !== undefined) updateFields.image = image;
    const user = await User.findOneAndUpdate(
      { email: session.user.email },
      updateFields,
      { new: true }
    );
    if (!user) return res.status(404).json({ message: 'User not found' });
    return res.status(200).json({ message: 'Profile updated', phone: user.phone, image: user.image });
  } catch (err) {
    return res.status(500).json({ message: 'Server error' });
  }
}