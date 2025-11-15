import type { NextApiRequest, NextApiResponse } from 'next';
import crypto from 'crypto';
import { connectDb } from '../../../lib/db';
import User from '../../../models/User';

type VerifyBody = {
  razorpay_payment_id?: string;
  razorpay_order_id?: string;
  razorpay_signature?: string;
  userId?: string;
  selectedPlan?: 'basic' | 'premium' | 'elite';
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ success: false, message: 'Method Not Allowed' });
  }

  const { razorpay_payment_id, razorpay_order_id, razorpay_signature, userId, selectedPlan } = (req.body || {}) as VerifyBody;

  if (!razorpay_payment_id || !razorpay_order_id || !razorpay_signature || !userId || !selectedPlan) {
    return res.status(400).json({ success: false, message: 'Missing required fields' });
  }

  if (!['basic', 'premium', 'elite'].includes(selectedPlan)) {
    return res.status(400).json({ success: false, message: 'Invalid selectedPlan' });
  }

  const secret = process.env.RAZORPAY_SECRET;
  if (!secret) {
    return res.status(500).json({ success: false, message: 'Server configuration error: RAZORPAY_SECRET not set' });
  }

  try {
    const body = `${razorpay_order_id}|${razorpay_payment_id}`;
    const expectedSignature = crypto.createHmac('sha256', secret).update(body).digest('hex');

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ success: false, message: 'Invalid signature' });
    }

    await connectDb();

    const now = new Date();
    const end = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

    const update = {
      subscriptionPlan: selectedPlan,
      subscriptionStatus: 'active',
      subscriptionStart: now,
      subscriptionEnd: end,
      paymentId: razorpay_payment_id,
    };

    const updated = await User.findByIdAndUpdate(userId, { $set: update }, { new: true });
    if (!updated) {
      return res.status(500).json({ success: false, message: 'User update failed' });
    }

    return res.status(200).json({ success: true, message: 'Payment verified and subscription updated.' });
  } catch (err: any) {
    console.error('Payment verification error', err);
    return res.status(500).json({ success: false, message: err?.message || 'Internal Server Error' });
  }
}