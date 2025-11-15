"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";

export default function Analytics() {
  const { data: session } = useSession();
  const [selectedPeriod, setSelectedPeriod] = useState("month");
  const [subscriptionPlan, setSubscriptionPlan] = useState<string | null>(null);
  const [planLoading, setPlanLoading] = useState<boolean>(true);

  type AnalyticsResponse = {
    totalRevenue: number;
    totalBookings: number;
    averageBookingValue: number;
    conversionRate: number;
    monthlyGrowth: number;
    topVenues: Array<{ name: string; revenue: number; bookings: number }>;
    recentBookings: Array<{ id: string; customer: string; venue: string; amount: number; date: string; status: string }>;
    revenueByMonth: Array<{ month: string; revenue: number }>;
  };

  const defaultAnalytics: AnalyticsResponse = {
    totalRevenue: 0,
    totalBookings: 0,
    averageBookingValue: 0,
    conversionRate: 0,
    monthlyGrowth: 0,
    topVenues: [],
    recentBookings: [],
    revenueByMonth: [],
  };

  const [analyticsData, setAnalyticsData] = useState<AnalyticsResponse>(defaultAnalytics);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    const fetchAnalytics = async () => {
      try {
        const ownerId = (session?.user as any)?.id;
        if (!ownerId) return;
        const url = `/api/analytics?ownerId=${ownerId}&range=${selectedPeriod}`;
        const res = await fetch(url, { credentials: 'include' });
        if (res.status === 304) {
          // No changes; keep current analytics data
          return;
        }
        if (!res.ok) throw new Error(`Failed to load (${res.status})`);
        const data: AnalyticsResponse = await res.json();
        if (!cancelled) setAnalyticsData(data);
      } catch (e: any) {
        if (!cancelled) setError(e?.message || 'Failed to load analytics');
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };
    fetchAnalytics();
    const id = setInterval(fetchAnalytics, 10000);
    return () => { cancelled = true; clearInterval(id); };
  }, [session?.user, selectedPeriod]);

  useEffect(() => {
    let cancelled = false;
    const fetchPlan = async () => {
      try {
        const res = await fetch('/api/auth/plan', { credentials: 'include' });
        if (!res.ok) throw new Error(`Failed to load plan (${res.status})`);
        const data = await res.json();
        if (!cancelled) setSubscriptionPlan(data?.subscriptionPlan ?? null);
      } catch (e) {
        if (!cancelled) setSubscriptionPlan(null);
      } finally {
        if (!cancelled) setPlanLoading(false);
      }
    };
    fetchPlan();
    const id = setInterval(fetchPlan, 15000);
    return () => { cancelled = true; clearInterval(id); };
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Confirmed': return 'bg-green-100 text-green-800';
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      case 'Cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const isElite = ((subscriptionPlan ?? (session?.user as any)?.subscriptionPlan) === 'elite');

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header */}
      <nav className="w-full bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <img src="/logo.png" alt="WeEnYou Logo" width={40} height={40} className="h-10 w-10 object-contain" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight text-gray-900">WeEnYou</span>
              <span className="block text-xs text-gray-500">Analytics Dashboard</span>
            </div>
          </div>
          <Link href="/" className="btn btn-secondary">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Home
          </Link>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {!isElite && !planLoading && (
          <div className="mb-8">
            <div className="card border-dashed border-2 border-gray-200">
              <div className="card-body text-center">
                <h2 className="text-xl font-bold text-gray-900 mb-2">Unlock Advanced Analytics</h2>
                <p className="text-gray-600 mb-4">Analytics is available with the Elite plan. Upgrade to view real-time revenue, bookings, top venues, and detailed reports.</p>
                <Link href="/pricing" className="btn btn-primary">Buy Elite</Link>
              </div>
            </div>
          </div>
        )}
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Analytics Dashboard</h1>
          <p className="text-gray-600">Track your revenue, bookings, and business performance</p>
        </div>

        {/* Period Selector */}
        <div className="mb-8">
          <div className="flex gap-2 bg-white rounded-lg p-1 shadow-sm">
            {['week', 'month', 'quarter', 'year'].map((period) => (
              <button
                key={period}
                onClick={() => setSelectedPeriod(period)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  selectedPeriod === period
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {period.charAt(0).toUpperCase() + period.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Key Metrics */}
        <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 ${(!isElite) ? 'pointer-events-none select-none blur-md' : ''}`}>
          <div className="card">
            <div className="card-body">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                  <p className="text-2xl font-bold text-gray-900">{formatCurrency(analyticsData?.totalRevenue || 0)}</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm">
                <span className="text-green-600 font-medium">+{analyticsData.monthlyGrowth}%</span>
                <span className="text-gray-500 ml-2">from last month</span>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-body">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Bookings</p>
                  <p className="text-2xl font-bold text-gray-900">{analyticsData?.totalBookings ?? 0}</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm">
                <span className="text-blue-600 font-medium">+8.2%</span>
                <span className="text-gray-500 ml-2">from last month</span>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-body">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Avg. Booking Value</p>
                  <p className="text-2xl font-bold text-gray-900">{formatCurrency(analyticsData?.averageBookingValue || 0)}</p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm">
                <span className="text-purple-600 font-medium">+5.1%</span>
                <span className="text-gray-500 ml-2">from last month</span>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-body">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Conversion Rate</p>
                  <p className="text-2xl font-bold text-gray-900">{analyticsData?.conversionRate ?? 0}%</p>
                </div>
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm">
                <span className="text-orange-600 font-medium">+2.3%</span>
                <span className="text-gray-500 ml-2">from last month</span>
              </div>
            </div>
          </div>
        </div>

        {/* Revenue Chart */}
        <div className={`grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8 ${(!isElite) ? 'pointer-events-none select-none blur-md' : ''}`}>
          <div className="card">
            <div className="card-header">
              <h3 className="text-lg font-semibold text-gray-900">Revenue Trend</h3>
            </div>
            <div className="card-body">
              <div className="space-y-4">
                {(analyticsData?.revenueByMonth || []).map((item, index) => (
                  <div key={item.month} className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-600">{item.month}</span>
                    <div className="flex items-center gap-4">
                      <div className="w-32 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full"
                          style={{ width: `${(() => { const base = analyticsData?.revenueByMonth?.[0]?.revenue || 1; return Math.max(2, Math.round((item.revenue / base) * 100)); })()}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium text-gray-900">{formatCurrency(item.revenue)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <h3 className="text-lg font-semibold text-gray-900">Top Performing Venues</h3>
            </div>
            <div className="card-body">
              <div className="space-y-4">
                {(analyticsData?.topVenues || []).map((venue, index) => (
                  <div key={venue.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-sm font-bold text-blue-600">{index + 1}</span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{venue.name}</p>
                        <p className="text-xs text-gray-500">{venue.bookings} bookings</p>
                      </div>
                    </div>
                    <span className="text-sm font-bold text-gray-900">{formatCurrency(venue.revenue)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Recent Bookings */}
        <div className={`card`}>
          <div className="card-header">
            <h3 className="text-lg font-semibold text-gray-900">Recent Bookings</h3>
          </div>
          <div className="card-body">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Booking ID</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Customer</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Venue</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Amount</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Date</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {(analyticsData?.recentBookings || []).map((booking) => (
                    <tr key={booking.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4 text-sm font-medium text-gray-900">{booking.id}</td>
                      <td className="py-3 px-4 text-sm text-gray-600">{booking.customer}</td>
                      <td className="py-3 px-4 text-sm text-gray-600">{booking.venue}</td>
                      <td className="py-3 px-4 text-sm font-medium text-gray-900">{formatCurrency(booking.amount)}</td>
                      <td className="py-3 px-4 text-sm text-gray-600">{new Date(booking.date).toLocaleDateString()}</td>
                      <td className="py-3 px-4">
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(booking.status)}`}>
                          {booking.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Export Section */}
        <div className="mt-8 card">
          <div className="card-body">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Export Analytics</h3>
                <p className="text-sm text-gray-600">Download your analytics data in various formats</p>
              </div>
              <div className="flex gap-3">
                <button className="btn btn-secondary">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Export PDF
                </button>
                <button className="btn btn-primary">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Export Excel
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}