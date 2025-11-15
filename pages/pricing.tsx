import Link from "next/link";

export default function Pricing() {
  const plans = [
    {
      name: "Basic",
      price: 0,
      period: "month",
      features: [
        "Standard Listing",
        "Access to Owner Portal",
      ],
      benefits: "Your banquet hall will be listed on the portal with regular visibility. Ideal for owners starting out and exploring the platform.",
      cta: "Get Started",
    },
    {
      name: "Premium",
      price: 1500,
      period: "month",
      features: [
        "Featured Tab Placement",
        "Standard Marketing (social media shoutout once per month)",
        "Access to basic analytics",
      ],
      benefits: "Your hall appears at the top of search results or highlighted section. Increased visibility leads to more inquiries and bookings.",
      cta: "Buy Now",
      highlight: true,
    },
    {
      name: "Elite",
      price: 3000,
      period: "month",
      features: [
        "Featured Tab Placement",
        "Full Marketing Package (newsletter banner, 2 email campaigns, social media)",
        "Advanced Analytics Report (views, clicks, bookings)",
        "Priority Support",
      ],
      benefits: "Maximum exposure for your hall. Best for halls seeking higher revenue and bookings.",
      cta: "Buy Now",
    },
  ];

  const formatINR = (amount: number) =>
    new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(amount);

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
              <span className="block text-xs text-gray-500">Pricing</span>
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
      <main className="max-w-7xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">WeEnYou Owner Portal Pricing</h1>
          <p className="text-gray-600">Choose a plan that fits your growth stage</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {plans.map((plan) => (
            <div key={plan.name} className={`relative rounded-2xl p-6 backdrop-blur-xl bg-white/40 border border-white/50 shadow-lg ${plan.highlight ? 'ring-2 ring-blue-500' : ''}`}>
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/50 to-white/20 pointer-events-none"></div>
              <div className="relative">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-2xl font-bold text-gray-900">{plan.name}</h3>
                  {plan.highlight && (
                    <span className="text-xs font-semibold px-2 py-1 rounded-full bg-blue-600 text-white">Popular</span>
                  )}
                </div>
                <div className="mb-4">
                  <span className="text-3xl font-extrabold text-gray-900">{plan.price === 0 ? 'Free' : formatINR(plan.price)}</span>
                  {plan.price !== 0 && <span className="text-gray-500"> / {plan.period}</span>}
                </div>

                <ul className="space-y-2 mb-4">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-gray-700">
                      <svg className="w-5 h-5 text-green-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>

                <p className="text-sm text-gray-600 mb-6">{plan.benefits}</p>

                <div className="flex">
                  {plan.name === 'Basic' ? (
                    <Link href="/" className="btn btn-secondary w-full">{plan.cta}</Link>
                  ) : (
                    <Link href={{ pathname: '/checkout', query: { plan: plan.name.toLowerCase(), amount: plan.price } }} className="btn btn-primary w-full">{plan.cta}</Link>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}


