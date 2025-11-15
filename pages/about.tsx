import Link from "next/link";

export default function About() {
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
              <span className="block text-xs text-gray-500">About Us</span>
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
      <main className="max-w-4xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">About WeEnYou</h1>
          <p className="text-xl text-gray-600">India's most trusted venue booking platform</p>
        </div>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Our Story */}
          <div className="card">
            <div className="card-body">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Story</h2>
              <p className="text-gray-600 mb-4">
                WeEnYou was founded with a simple mission: to connect venue owners with event planners 
                and customers across India. We believe that every beautiful venue deserves to be discovered, 
                and every event deserves the perfect space.
              </p>
              <p className="text-gray-600">
                Since our launch, we've helped over 500+ venues across India increase their bookings 
                and reach thousands of customers looking for the perfect event space.
              </p>
            </div>
          </div>

          {/* Our Mission */}
          <div className="card">
            <div className="card-body">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h2>
              <p className="text-gray-600 mb-4">
                To revolutionize the venue booking industry by providing a seamless, secure, and 
                user-friendly platform that empowers venue owners to grow their business while 
                helping customers find their perfect event space.
              </p>
              
            </div>
          </div>
        </div>

        {/* Values */}
        <div className="mt-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Our Values</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="card text-center">
              <div className="card-body">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Trust & Security</h3>
                <p className="text-gray-600">We prioritize the security and trust of our users with SSL encryption and secure payment processing.</p>
              </div>
            </div>

            <div className="card text-center">
              <div className="card-body">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Innovation</h3>
                <p className="text-gray-600">We continuously innovate our platform to provide the best user experience and business solutions.</p>
              </div>
            </div>

            <div className="card text-center">
              <div className="card-body">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Customer First</h3>
                <p className="text-gray-600">Our customers are at the heart of everything we do. We provide 24/7 support and personalized service.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Team */}
        <div className="mt-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Our Team</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="card">
              <div className="card-body text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-white">SA</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Sohel Akhtar</h3>
                <p className="text-blue-600 font-medium mb-2">Founder & CEO</p>
                <p className="text-gray-600">10+ years experience in hospitality and technology</p>
              </div>
            </div>

            <div className="card">
              <div className="card-body text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-white">KJ</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Krish Jaiswal</h3>
                <p className="text-green-600 font-medium mb-2">Head of Operations</p>
                <p className="text-gray-600">Expert in venue management and customer success</p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-12 text-center">
          <div className="card max-w-2xl mx-auto">
            <div className="card-body">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Join Our Success Story</h2>
              <p className="text-gray-600 mb-6">Ready to grow your venue business with WeEnYou?</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/list-your-hall">
                  <button className="btn btn-primary">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                    </svg>
                    Get Started Today
                  </button>
                </Link>
                <Link href="/contact">
                  <button className="btn btn-secondary">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    Contact Us
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
} 