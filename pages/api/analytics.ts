import type { NextApiRequest, NextApiResponse } from 'next';
import mongoose from 'mongoose';
import { connectDb } from '../../lib/db';
import Booking from '../../models/Booking';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../lib/auth';

function getRangeBounds(range: string, startOverride?: string, endOverride?: string): { start: Date; end: Date; unit: 'day' | 'month' } {
  const now = new Date();
  if (startOverride && endOverride) {
    const start = new Date(startOverride);
    const end = new Date(endOverride);
    return { start, end, unit: 'day' };
  }
  let start: Date;
  let end: Date;
  let unit: 'day' | 'month' = 'day';
  switch (range) {
    case 'week': {
      // last 7 days: today-6 to end of today
      const todayUtc = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
      start = new Date(todayUtc.getTime() - 6 * 24 * 60 * 60 * 1000);
      end = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), 23, 59, 59, 999));
      unit = 'day';
      break;
    }
    case 'month': {
      // full current month
      start = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1));
      end = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 0, 23, 59, 59, 999));
      unit = 'day';
      break;
    }
    case 'quarter': {
      const qStartMonth = Math.floor(now.getUTCMonth() / 3) * 3;
      start = new Date(Date.UTC(now.getUTCFullYear(), qStartMonth, 1));
      // end of quarter
      end = new Date(Date.UTC(now.getUTCFullYear(), qStartMonth + 3, 0, 23, 59, 59, 999));
      unit = 'month';
      break;
    }
    case 'year': {
      start = new Date(Date.UTC(now.getUTCFullYear(), 0, 1));
      end = new Date(Date.UTC(now.getUTCFullYear(), 11, 31, 23, 59, 59, 999));
      unit = 'month';
      break;
    }
    default: {
      start = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1));
      end = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 0, 23, 59, 59, 999));
      unit = 'day';
    }
  }
  return { start, end, unit };
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { ownerId: ownerIdQuery, range = 'month', startDate: startOverride, endDate: endOverride, owner: ownerParam } = req.query as { ownerId?: string; range?: string; startDate?: string; endDate?: string; owner?: string };
  const debug = String((req.query as any)?.debug || '').toLowerCase() === 'true';

  let ownerId = ownerIdQuery;
  if (ownerParam === 'me') {
    const session = await getServerSession(req, res, authOptions as any);
    const user = (session?.user as any) || null;
    if (!user || user.role !== 'owner' || user.status !== 'active') {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    ownerId = user.id;
  } else if (!ownerId) {
    const session = await getServerSession(req, res, authOptions as any);
    ownerId = (session?.user as any)?.id || undefined;
  }
  if (!ownerId || !mongoose.Types.ObjectId.isValid(ownerId)) {
    return res.status(400).json({ message: 'Invalid or missing ownerId' });
  }

  try {
    await connectDb();

    const { start, end, unit } = getRangeBounds(String(range), startOverride, endOverride);
    const ownerObjectId = new mongoose.Types.ObjectId(ownerId);
    // Base matches per spec fields
    const baseRangeMatch = { ownerId: ownerObjectId, startDate: { $gte: start, $lte: end } };
    const createdRangeMatch = { ownerId: ownerObjectId, createdAt: { $gte: start, $lte: end } };

    if (debug) {
      console.log('[analytics] params', { ownerId, range, startOverride, endOverride });
      console.log('[analytics] bounds', { start: start.toISOString(), end: end.toISOString(), unit });
      const totalInRange = await Booking.countDocuments(baseRangeMatch);
      const totalCreatedInRange = await Booking.countDocuments(createdRangeMatch);
      console.log('[analytics] pre-agg counts', { totalInRange, totalCreatedInRange });
    }

    const pipeline = [
      { $match: baseRangeMatch },
      {
        $facet: {
          revenueMetrics: [
            { $match: { status: { $in: ['approved', 'confirmed'] }, $or: [{ paymentStatus: 'paid' }, { finalPaymentStatus: 'paid' }] } },
            { $lookup: { from: 'halls', localField: 'hallId', foreignField: '_id', as: 'hall' } },
            { $group: { _id: null, totalRevenue: { $sum: { $ifNull: [{ $arrayElemAt: ['$hall.price', 0] }, 0] } } } },
          ],

          bookingsMetrics: [
            {
              $group: {
                _id: null,
                totalBookings: { $sum: { $cond: [{ $in: ['$status', ['approved', 'confirmed']] }, 1, 0] } },
              },
            },
          ],

          requestsMetrics: [
            { $match: createdRangeMatch },
            {
              $group: {
                _id: null,
                totalRequests: { $sum: 1 },
                cancelledCount: { $sum: { $cond: [{ $eq: ['$status', 'cancelled'] }, 1, 0] } },
              },
            },
          ],

          revenueTrend: [
            { $match: baseRangeMatch },
            {
              $addFields: {
                bucketDate: {
                  $dateTrunc: { date: '$startDate', unit, timezone: 'UTC' },
                },
              },
            },
            { $match: { status: { $in: ['approved', 'confirmed'] }, $or: [{ paymentStatus: 'paid' }, { finalPaymentStatus: 'paid' }] } },
            { $lookup: { from: 'halls', localField: 'hallId', foreignField: '_id', as: 'hall' } },
            {
              $group: {
                _id: '$bucketDate',
                revenue: { $sum: { $ifNull: [{ $arrayElemAt: ['$hall.price', 0] }, 0] } },
                bookings: { $sum: 1 },
              },
            },
            { $sort: { _id: 1 } },
            {
              $project: {
                _id: 0,
                date: { $dateToString: { date: '$_id', format: '%Y-%m-%d' } },
                revenue: { $ifNull: ['$revenue', 0] },
                bookings: { $ifNull: ['$bookings', 0] },
              },
            },
          ],

          topVenues: [
            { $match: baseRangeMatch },
            { $match: { $or: [{ paymentStatus: 'paid' }, { finalPaymentStatus: 'paid' }] } },
            { $lookup: { from: 'halls', localField: 'hallId', foreignField: '_id', as: 'hall' } },
            {
              $group: {
                _id: '$hallId',
                revenue: { $sum: { $ifNull: [{ $arrayElemAt: ['$hall.price', 0] }, 0] } },
                bookings: { $sum: 1 },
              },
            },
            { $sort: { revenue: -1 } },
            { $limit: 5 },
            {
              $lookup: { from: 'halls', localField: '_id', foreignField: '_id', as: 'venue' },
            },
            {
              $project: {
                _id: 0,
                venueId: '$_id',
                name: { $ifNull: [{ $arrayElemAt: ['$venue.name', 0] }, null] },
                revenue: { $ifNull: ['$revenue', 0] },
                bookings: { $ifNull: ['$bookings', 0] },
              },
            },
          ],

          recentBookings: [
            { $match: baseRangeMatch },
            {
              $match: {
                status: { $in: ['approved', 'confirmed'] },
                $or: [
                  { remainingAmount: { $lte: 0 } },
                  { finalPaymentStatus: 'paid' },
                  { paymentStatus: 'paid' },
                  { $expr: { $lte: [ { $subtract: [ { $ifNull: ['$totalPrice', 0] }, { $ifNull: ['$advanceAmountPaid', 0] } ] }, 0 ] } },
                ],
              },
            },
            { $sort: { createdAt: -1 } },
            { $limit: 10 },
            { $lookup: { from: 'halls', localField: 'hallId', foreignField: '_id', as: 'hall' } },
            { $lookup: { from: 'users', localField: 'userId', foreignField: '_id', as: 'user' } },
            {
              $project: {
                id: { $toString: '$_id' },
                status: '$status',
                customer: { $ifNull: [{ $arrayElemAt: ['$user.name', 0] }, { $toString: '$userId' }] },
                venue: { $ifNull: [{ $arrayElemAt: ['$hall.name', 0] }, null] },
                amount: { $ifNull: [{ $arrayElemAt: ['$hall.price', 0] }, 0] },
                date: '$startDate',
                bookingId: { $toString: '$_id' },
                totalPrice: { $ifNull: ['$totalPrice', 0] },
                advanceAmountPaid: { $ifNull: ['$advanceAmountPaid', 0] },
                remainingAmount: { $ifNull: ['$remainingAmount', 0] },
                startDate: '$startDate',
                endDate: '$endDate',
                paymentStatus: '$paymentStatus',
                orderId: '$orderId',
                paymentId: '$paymentId',
              },
            },
          ],

          financials: [
            { $match: baseRangeMatch },
            {
              $group: {
                _id: null,
                advanceCollected: { $sum: { $ifNull: ['$advanceAmountPaid', 0] } },
              },
            },
            {
              $project: { _id: 0, advanceCollected: { $ifNull: ['$advanceCollected', 0] } },
            },
          ],

          dues: [
            { $match: baseRangeMatch },
            {
              $project: {
                due: {
                  $cond: [
                    { $gt: [{ $ifNull: ['$remainingAmount', 0] }, 0] },
                    { $ifNull: ['$remainingAmount', 0] },
                    { $cond: [
                        { $or: [{ $ne: ['$paymentStatus', 'paid'] }, { $ne: ['$finalPaymentStatus', 'paid'] }] },
                        { $subtract: [{ $ifNull: ['$totalPrice', 0] }, { $ifNull: ['$advanceAmountPaid', 0] }] },
                        0,
                      ]
                    },
                  ],
                },
              },
            },
            { $group: { _id: null, totalDue: { $sum: '$due' } } },
            { $project: { _id: 0, totalDue: { $ifNull: ['$totalDue', 0] } } },
          ],
        },
      },
    ];

    const agg = await Booking.aggregate(pipeline);
    const data = agg[0] || {};

    const revenueSum = data.revenueMetrics?.[0]?.totalRevenue ?? 0;
    const totalBookings = data.bookingsMetrics?.[0]?.totalBookings ?? 0;
    const totalRequests = data.requestsMetrics?.[0]?.totalRequests ?? 0;
    const cancelledCount = data.requestsMetrics?.[0]?.cancelledCount ?? 0;
    const avgBookingValue = totalBookings > 0 ? revenueSum / totalBookings : 0;
    const conversionRate = totalRequests > 0 ? (totalBookings / totalRequests) * 100 : 0;
    const cancellationRate = totalRequests > 0 ? (cancelledCount / totalRequests) * 100 : 0;

    const advanceCollected = data.financials?.[0]?.advanceCollected ?? 0;
    const totalDue = data.dues?.[0]?.totalDue ?? 0;

    // Backward compatibility for existing frontend
    const topVenues = data.topVenues || [];
    const recentBookings = data.recentBookings || [];
    const revenueTrend = data.revenueTrend || [];

    if (debug) {
      console.log('[analytics] metrics', {
        revenueSum,
        totalBookings,
        totalRequests,
        cancelledCount,
        avgBookingValue,
        conversionRate,
        cancellationRate,
        advanceCollected,
        totalDue,
      });
      console.log('[analytics] arrays', {
        revenueTrendLen: revenueTrend.length,
        topVenuesLen: topVenues.length,
        recentBookingsLen: recentBookings.length,
      });
      if (recentBookings[0]) {
        console.log('[analytics] recent sample', recentBookings[0]);
      }
    }

    // Provide a "month"-labelled series for the frontend regardless of unit
    // Use the projected date string as the label
    const revenueByMonth = (Array.isArray(revenueTrend) ? revenueTrend : []).map((it: any) => ({ month: it?.date, revenue: it?.revenue ?? 0 }));

    // Prevent caching to ensure near real-time analytics
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');
    return res.status(200).json({
      // Spec fields
      totalRevenue: Number(revenueSum) || 0,
      totalBookings: Number(totalBookings) || 0,
      avgBookingValue: Number(avgBookingValue) || 0,
      conversionRate: Number(conversionRate) || 0,
      revenueTrend,
      topPerformingVenues: topVenues,
      recentBookings,
      advanceCollected: Number(advanceCollected) || 0,
      totalDue: Number(totalDue) || 0,
      cancellationRate: Number(cancellationRate) || 0,

      // Frontend compatibility fields
      averageBookingValue: Number(avgBookingValue) || 0,
      monthlyGrowth: 0,
      revenueByMonth,
      topVenues,
    });
  } catch (e: any) {
    console.error('Analytics error', e);
    return res.status(500).json({ message: 'Server error', error: e?.message || String(e) });
  }
}