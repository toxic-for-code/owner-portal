import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../../lib/auth';
import mongoose from 'mongoose';
import { connectDb } from '../../../lib/db';
import Hall from '../../../models/Hall';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();
  const session = await getServerSession(req, res, authOptions);
  if (!session || session.user.role !== 'admin') {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  await connectDb();
  const { hallId, featured } = req.body;
  if (!hallId || typeof featured !== 'boolean') {
    return res.status(400).json({ message: 'Invalid request' });
  }
  const hall = await Hall.findByIdAndUpdate(hallId, { featured }, { new: true });
  if (!hall) return res.status(404).json({ message: 'Hall not found' });
  res.status(200).json({ hall });
}