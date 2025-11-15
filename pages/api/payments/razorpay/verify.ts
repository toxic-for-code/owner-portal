import type { NextApiRequest, NextApiResponse } from 'next';
import crypto from 'crypto';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../../../lib/auth';
import mongoose from 'mongoose';
import { connectDb } from '../../../../lib/db';
import User from '../../../../models/User';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();

  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  if (!keySecret) return res.status(500).json({ message: 'Razorpay secret missing' });

  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, plan } = req.body || {};
  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
    return res.status(400).json({ message: 'Missing parameters' });
  }

  const body = `${razorpay_order_id}|${razorpay_payment_id}`;
  const expectedSignature = crypto.createHmac('sha256', keySecret).update(body).digest('hex');
  const isValid = expectedSignature === razorpay_signature;

  if (!isValid) {
    return res.status(400).json({ verified: false });
  }

  // Update the current user's subscription plan in the database
  try {
    const session = await getServerSession(req, res, authOptions);
    if (!session || !session.user?.email) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    // Normalize plan (default to 'premium' if not provided)
    const normalizedPlan = (typeof plan === 'string' ? plan.toLowerCase() : 'premium') as 'basic' | 'premium' | 'elite';

    if (mongoose.connection.readyState === 0) {
      await connectDb();
    }

    const updated = await User.findOneAndUpdate(
      { email: session.user.email },
      { $set: { role: 'owner', subscriptionPlan: normalizedPlan } },
      { new: true }
    ).lean();

    if (!updated) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.status(200).json({ verified: true, subscriptionPlan: updated.subscriptionPlan });
  } catch (e: any) {
    return res.status(500).json({ verified: true, message: 'Payment verified but failed to update subscription', error: e?.message || String(e) });
  }
}





