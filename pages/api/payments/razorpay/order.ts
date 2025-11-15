import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();

  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  if (!keyId || !keySecret) {
    return res.status(500).json({ message: 'Razorpay environment variables missing' });
  }

  try {
    const { amount, plan } = req.body as { amount: number; plan?: string };
    if (!amount || typeof amount !== 'number' || amount <= 0) {
      return res.status(400).json({ message: 'Invalid amount' });
    }

    const auth = Buffer.from(`${keyId}:${keySecret}`).toString('base64');
    const orderRes = await fetch('https://api.razorpay.com/v1/orders', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount: amount * 100, // paise
        currency: 'INR',
        receipt: `receipt_${Date.now()}`,
        notes: { plan: plan || 'unknown' },
      }),
    });

    if (!orderRes.ok) {
      const errText = await orderRes.text();
      return res.status(502).json({ message: 'Failed to create order', detail: errText });
    }

    const order = await orderRes.json();
    return res.status(200).json({ order, keyId });
  } catch (e: any) {
    return res.status(500).json({ message: 'Server error', error: e?.message || String(e) });
  }
}





