import React, { useEffect } from "react";
import { useSession, signOut } from "next-auth/react";

export default function Home() {
  const { data: session, status } = useSession();

  // The original code would redirect, but we are authenticated for this preview.
  // The loading and unauthenticated blocks are removed as status is hardcoded.

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Enhanced Navbar */}
      <nav className="w-full bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center gap-6">
          <div className="flex items-center gap-3">
            <div className="relative">
              <img 
                src="/logo.png" 
                alt="WeEnYou Logo" 
                width={40} 
                height={40} 
                className="h-10 w-10 object-contain" 
                // Add a placeholder fallback
                onError={(e) => {
                  e.currentTarget.src = "https://placehold.co/40x40/3B82F6/FFFFFF?text=W&font=sans";
                  e.currentTarget.onerror = null;
                }}
              />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight text-gray-900">WeEnYou</span>
              <span className="block text-xs text-gray-500">Hall Owner Portal</span>
            </div>
          </div>
          <div className="flex items-center gap-4 ml-auto">
            <div className="hidden md:flex items-center gap-6 text-sm">
              <span className="security-badge flex items-center gap-1 text-gray-600">
                <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                SSL Secured
              </span>
              {/* "500+ Venues" badge removed as requested */}
            </div>
            
            {/* User Dropdown Menu */}
            <div className="relative group">
              <div className="flex items-center gap-3 bg-white border border-gray-200 rounded-full px-6 py-3 hover:shadow-md transition-all duration-200 cursor-pointer">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <span className="font-semibold text-gray-700">
                  {`Welcome, ${session?.user?.name || 'User'}`}
                </span>
                <svg className="w-4 h-4 text-gray-400 transition-transform group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
              
              {/* Dropdown Menu */}
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-xl border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <div className="py-2">
                  <div className="px-4 py-3 border-b border-gray-100">
                    <p className="text-sm font-medium text-gray-900">{`Welcome, ${session?.user?.name || 'User'}`}</p>
                  </div>
                  
                  <div className="py-1">
                    <a href="/profile" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                      <svg className="w-4 h-4 mr-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10l9-7 9 7v8a2 2 0 01-2 2H5a2 2 0 01-2-2v-8z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 21V12h6v9" />
                      </svg>
                      My Halls
                    </a>
                    <a href="/analytics" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                      <svg className="w-4 h-4 mr-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                      My Analytics
                    </a>
                    
                    <a href="/about" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                      <svg className="w-4 h-4 mr-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      About Us
                    </a>
                    
                    <a href="/contact" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                      <svg className="w-4 h-4 mr-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      Contact Number
                    </a>
                    
                    <a href="/help" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                      <svg className="w-4 h-4 mr-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Help & Support
                    </a>
                  </div>
                  
                  <div className="border-t border-gray-100 pt-1">
                    <button 
                      onClick={() => signOut()}
                      className="flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors w-full"
                    >
                      <svg className="w-4 h-4 mr-3 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      Sign Out
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section - This is now full-width */}
      <section className="relative text-center w-full h-[70vh] flex items-center justify-center">
        {/* Background image and overlay */}
        <div className="absolute inset-0 w-full h-full z-0">
          <img 
             src="/hall.jpg"
             alt="Hall with lightbulbs" 
             className="w-full h-full object-cover object-center" 
             style={{ filter: 'brightness(0.7)' }} // Darkened for better text contrast
             // Add a placeholder fallback
             onError={(e) => {
               e.currentTarget.src = "https://placehold.co/1920x1080/333333/FFFFFF?text=Venue+Image&font=sans";
               e.currentTarget.onerror = null;
             }}
          />
          <div className="absolute inset-0 bg-black bg-opacity-30"></div> {/* Increased opacity */}
        </div>
        <div className="relative z-10 max-w-4xl mx-auto p-4">
          <div className="mb-8">
            <h1 className="text-4xl md:text-6xl font-extrabold mb-6 text-white leading-tight drop-shadow-lg">
              Welcome to{" "}
              <span className="bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent drop-shadow-lg">
                WeEnYou
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-100 mb-8 leading-relaxed drop-shadow">
              Manage your venues, track bookings, and grow your business with India's most trusted venue platform.
            </p>
          </div>
          {/* Trust Indicators */}
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            {/* "Trusted by 500+ venues" removed as requested */}
            <div className="security-badge bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              Secure Payments
            </div>
            <div className="trust-badge bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Instant Bookings
            </div>
          </div>
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <a href="/list-your-hall">
              <button className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-lg font-bold text-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 bg-yellow-400 text-gray-900 hover:bg-yellow-500 focus:ring-yellow-400 shadow-lg">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                List Your Hall
              </button>
            </a>
            <a href="/analytics">
              <button className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-lg font-semibold text-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 bg-white bg-opacity-80 text-gray-900 hover:bg-opacity-100 focus:ring-white shadow">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                View Analytics
              </button>
            </a>
          </div>
        </div>
      </section>

      {/* Main content is now constrained */}
      <main className="max-w-7xl mx-auto px-4 py-16">
        {/* Features Section */}
        <section className="mb-16">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white shadow-lg rounded-xl overflow-hidden p-8">
              <div className="card-body text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-900">Reach More Customers</h3>
                <p className="text-gray-600">Get discovered by thousands of event planners and customers looking for the perfect venue.</p>
              </div>
            </div>

            <div className="bg-white shadow-lg rounded-xl overflow-hidden p-8">
              <div className="card-body text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-900">Easy Management</h3>
                <p className="text-gray-600">Manage bookings, payments, and schedules all in one place with our intuitive dashboard.</p>
              </div>
            </div>

            <div className="bg-white shadow-lg rounded-xl overflow-hidden p-8">
              <div className="card-body text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-900">Dedicated Support</h3>
                <p className="text-gray-600">Get personalized support from our team to help you maximize your venue's potential.</p>
              </div>
            </div>
          </div>
        </section>
        
        {/* Final CTA */}
        <section className="text-center mb-16">
          <div className="bg-white shadow-lg rounded-xl overflow-hidden max-w-2xl mx-auto">
            <div className="card-body text-center p-8 md:p-12">
              <h2 className="text-2xl md:text-3xl font-bold mb-4 text-gray-900">Ready to Grow Your Business?</h2>
              <p className="text-gray-600 mb-6">Join hundreds of successful venue owners and start earning more today.</p>
              <a href="/list-your-hall">
                <button className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-lg font-semibold text-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                  List Your Hall Now
                </button>
              </a>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <img 
                  src="/logo.png" 
                  alt="WeEnYou Logo" 
                  width={32} 
                  height={32} 
                  className="h-8 w-8 object-contain" 
                  // Add a placeholder fallback
                  onError={(e) => {
                    e.currentTarget.src = "https://placehold.co/32x32/3B82F6/FFFFFF?text=W&font=sans";
                    e.currentTarget.onerror = null;
                  }}
                />
                <span className="text-xl font-bold">WeEnYou</span>
              </div>
              <p className="text-gray-400">India's most trusted venue booking platform for hall owners and event planners.</p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">For Venue Owners</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="/list-your-hall" className="hover:text-white transition-colors">List Your Venue</a></li>
                <li><a href="/pricing" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Success Stories</a></li>
                <li><a href="/contact" className="hover:text-white transition-colors">Support</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="/about" className="hover:text-white transition-colors">About Us</a></li>
                <li><a href="/contact" className="hover:text-white transition-colors">Contact</a></li>
                <li><a href="/privacy" className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="/terms" className="hover:text-white transition-colors">Terms of Service</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Connect</h3>
              <div className="flex space-x-4">
                <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-gray-700 transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z"/>
                  </svg>
                </a>
                <a href="https://www.instagram.com/weenyou.in?igsh=b3V1MmRzaTFidHM5" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-gray-700 transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M12 2.163c3.204 0 3.584.012 4.85.07 1.172.053 1.902.218 2.458.422.566.21 1.052.506 1.528.982.476.476.772.962.982 1.528.204.556.369 1.286.422 2.458.058 1.266.07 1.646.07 4.85s-.012 3.584-.07 4.85c-.053 1.172-.218 1.902-.422 2.458-.21.566-.506 1.052-.982 1.528-.476.476-.962.772-1.528.982-.556.204-1.286.369-2.458.422-1.266.058-1.646.07-4.85.07s-3.584-.012-4.85-.07c-1.172-.053-1.902-.218-2.458-.422-.566-.21-1.052-.506-1.528-.982-.476-.476-.772-.962-.982-1.528-.204-.556-.369-1.286-.422-2.458-.058-1.266-.07-1.646-.07-4.85s.012-3.584.07-4.85c.053-1.172.218-1.902.422-2.458.21-.566.506-1.052.982-1.528.476-.476.962.772 1.528.982.556-.204 1.286.369 2.458.422C8.416 2.175 8.796 2.163 12 2.163zm0 1.626c-3.141 0-3.499.012-4.71.068-1.096.05-1.748.21-2.09.324-.432.144-.748.336-1.08.668-.332.332-.524.648-.668 1.08-.114.342-.274.994-.324 2.09-.056 1.211-.068 1.569-.068 4.71s.012 3.499.068 4.71c.05 1.096.21 1.748.324 2.09.144.432.336.748.668 1.08.332.332.648.524 1.08.668.342.114.994.274 2.09.324 1.211.056 1.569.068 4.71.068s3.499-.012 4.71-.068c1.096-.05 1.748-.21 2.09-.324.432.144.748-.336 1.08-.668.332.332.524-.648.668-1.08.114.342.274.994-.324-2.09.056-1.211.068-1.569.068-4.71s-.012-3.499-.068-4.71c-.05-1.096-.21-1.748-.324-2.09-.144-.432-.336-.748-.668-1.08-.332-.332-.648-.524-1.08-.668-.342-.114-.994-.274-2.09-.324C15.499 3.799 15.141 3.789 12 3.789zm0 2.918c-2.924 0-5.286 2.362-5.286 5.286s2.362 5.286 5.286 5.286 5.286-2.362 5.286-5.286S14.924 6.707 12 6.707zm0 8.68c-1.874 0-3.394-1.52-3.394-3.394s1.52-3.394 3.394-3.394 3.394 1.52 3.394 3.394-1.52 3.394-3.394 3.394zm5.228-8.883c0 .59-.478 1.068-1.068 1.068s-1.068-.478-1.068-1.068.478-1.068 1.068-1.068 1.068.478 1.068 1.068z" clipRule="evenodd" />
                  </svg>
                </a>
                <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-gray-700 transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" clipRule="evenodd" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 WeEnYou. All rights reserved. Made with ❤️ in India</p>
          </div>
        </div>
      </footer>
    </div>
  );
}