import { getServerSession } from 'next-auth/next';
import { NextApiRequest, NextApiResponse } from 'next';
import mongoose from 'mongoose';
import { connectDb } from '../../lib/db';
import Hall from '../../models/Hall';
import { authOptions } from '../../lib/auth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);

  if (!session || !session.user || (session.user as any).role !== 'owner' || (session.user as any).status !== 'active') {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  await connectDb();

  if (req.method === 'GET') {
    // Only allow ?owner=me for now
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

      const halls = await Hall.find(query).sort({ createdAt: -1 });
      return res.status(200).json({ halls });
    } else {
      return res.status(400).json({ message: 'Invalid query' });
    }
  }

  if (req.method === 'POST') {
    const { name, description, images, price, capacity, amenities, address, city, state, pincode } = req.body;
    // For now, set coordinates to [0,0]. You can update this to use real geocoding.
    const hall = await Hall.create({
      name,
      description,
      images: images || [],
      price,
      capacity,
      amenities: amenities || [],
      location: {
        address,
        city,
        state,
        pincode,
        coordinates: { type: 'Point', coordinates: [0, 0] },
      },
      ownerId: (session.user as any).id,
      status: 'pending',
      verified: false,
      featured: false,
    });
    return res.status(201).json({ message: 'Hall created', hall });
  }

  return res.status(405).end();
}