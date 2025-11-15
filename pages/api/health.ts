import type { NextApiRequest, NextApiResponse } from 'next';
import mongoose from 'mongoose';
import { connectDb, getDbName } from '../../lib/db';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../lib/auth';
import User from '../../models/User';
import Hall from '../../models/Hall';
import Booking from '../../models/Booking';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);
  try {
  await connectDb();
  } catch (e) {
    return res.status(500).json({ ok: false, error: 'DB connect failed', details: String(e) });
  }

  const dbName = getDbName();
  const connected = mongoose.connection.readyState === 1;
  const uri = process.env.MONGODB_URI || '';
  const hostMatch = uri.match(/@([^/?]+)/);
  const clusterHost = hostMatch ? hostMatch[1] : 'unknown';
  const driver = (mongoose as any).version || 'unknown';
  const protocol = uri.startsWith('mongodb+srv://') ? 'mongodb+srv' : (uri.startsWith('mongodb://') ? 'mongodb' : 'unknown');
  const sessionUser = session?.user
    ? { id: (session.user as any).id, email: session.user.email, role: (session.user as any).role, status: (session.user as any).status }
    : null;

  // Global counts
  const usersCount = await User.countDocuments({});
  const hallsTotal = await Hall.countDocuments({});
  const bookingsTotal = await Booking.countDocuments({});

  // Owner-specific counts (if logged in)
  let ownerHalls = 0;
  let ownerBookings = 0;
  if (sessionUser?.id) {
    const ownerId = new mongoose.Types.ObjectId(sessionUser.id);
    ownerHalls = await Hall.countDocuments({ ownerId });
    ownerBookings = await Booking.countDocuments({ ownerId });
  }

  return res.status(200).json({
    ok: true,
    dbName,
    connected,
    clusterHost,
    protocol,
    driver,
    sessionUser,
    counts: {
      users: usersCount,
      halls_total: hallsTotal,
      halls_for_owner: ownerHalls,
      bookings_total: bookingsTotal,
      bookings_for_owner: ownerBookings,
    },
  });
}