import type { NextApiRequest, NextApiResponse } from 'next';
import mongoose from 'mongoose';
import { connectDb } from '../../../lib/db';
import bcrypt from 'bcryptjs';
import User from '../../../models/User';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();
  await connectDb();

  const { name, email, password, phone } = req.body;
  const existing = await User.findOne({ email });
  if (existing) return res.status(400).json({ message: 'Email already exists' });

  const hash = await bcrypt.hash(password, 10);
  const user = await User.create({
    name,
    email,
    password: hash,
    phone,
    role: 'owner',
    status: 'active'
  });
  res.status(201).json({ message: 'User created', user: { id: user._id, email: user.email } });
}