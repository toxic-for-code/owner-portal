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
    if (req.query.owner === 'me') {
      const ownerId = (session.user as any).id;
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
    const {
      // Basic
      name, venueType, description, contactNumber, ownerEmail,
      // Location
      address, city, state, pincode,
      nearestAirportKm, nearestRailwayKm, nearestMetroKm, mapEmbedUrl,
      // Payout (New)
      payoutDetails,
      // Comprehensive fields
      images, price, capacity, amenities, highlights, eventSpaces,
      pricing, catering, decoration, vendors, accommodation, policies, parking,
      photoCategories, blockedDates, allowReviews,
    } = req.body;

    const hall = await Hall.create({
      name,
      venueType: venueType || '',
      description,
      contactNumber: contactNumber || '',
      ownerEmail: ownerEmail || '',
      payoutDetails: payoutDetails || { payoutMethod: '' }, // Add payout details
      images: images || [],
      photoCategories: photoCategories || {},
      price: price || pricing?.startingPrice || 0,
      capacity: capacity || (eventSpaces?.[0]?.seatingCapacity) || 1,
      amenities: amenities || [],
      highlights: highlights || [],
      eventSpaces: eventSpaces || [],
      pricing: pricing || {},
      catering: catering || {},
      decoration: decoration || {},
      vendors: vendors || {},
      accommodation: accommodation || {},
      policies: policies || {},
      parking: parking || {},
      allowReviews: allowReviews !== false,
      blockedDates: blockedDates || [],
      location: {
        address,
        city,
        state,
        pincode,
        coordinates: { type: 'Point', coordinates: [0, 0] },
        nearestAirportKm: nearestAirportKm || null,
        nearestRailwayKm: nearestRailwayKm || null,
        nearestMetroKm: nearestMetroKm || null,
        mapEmbedUrl: mapEmbedUrl || '',
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