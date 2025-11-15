import { useState } from 'react'; // Import useState for accordion

export default function Help() {
  const faqs = [
    {
      question: "How do I list my venue on WeEnYou?",
      answer: "To list your venue, first create an account, then go to 'List Your Hall' and fill out the venue details form. Our team will review and approve your listing within 24 hours."
    },
    {
      question: "What commission does WeEnYou charge?",
      answer: "WeEnYou charges a competitive 5% commission on successful bookings. This covers our platform costs, payment processing, and customer support services."
    },
    {
      question: "How do I receive payments for bookings?",
      answer: "Payments are automatically transferred to your registered bank account within 3-5 business days after the event date. You can track all payments in your analytics dashboard."
    },
    {
      question: "Can I edit my venue details after listing?",
      answer: "Yes, you can edit your venue details anytime from your dashboard. Changes are reviewed and updated within 2 hours during business hours."
    },
    {
      question: "What happens if a customer cancels a booking?",
      answer: "Cancellation policies are set by you. We recommend a 50% refund for cancellations within 7 days of the event. You can customize this in your venue settings."
    },
    {
      question: "How do I contact customer support?",
      answer: "You can reach our support team at +91 98315 11897 or support@weenyou.com. We respond within 2 hours during business hours."
    }
  ];

  // State for accordion
  const [openFaq, setOpenFaq] = useState(null);

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 font-sans">
      {/* Header */}
      <nav className="w-full bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
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
              <span className="block text-xs text-gray-500">Help & Support</span>
            </div>
          </div>
          <a href="/" className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-md font-semibold text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 bg-gray-100 text-gray-700 hover:bg-gray-200 focus:ring-gray-500">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Home
          </a>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-12 md:py-20">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Help & Support</h1>
          <p className="text-xl text-gray-600">Find answers to common questions and get the help you need</p>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {/* FAQs Card */}
          <div className="bg-white shadow-lg rounded-xl overflow-hidden text-center p-6">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">FAQs</h3>
            <p className="text-gray-600 mb-4 text-sm">Find answers to common questions</p>
            <a href="#faqs" className="text-blue-600 font-medium hover:underline">Browse FAQs</a>
          </div>

          {/* Contact Support Card */}
          <div className="bg-white shadow-lg rounded-xl overflow-hidden text-center p-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Contact Support</h3>
            <p className="text-gray-600 mb-4 text-sm">Get help from our team</p>
            <a href="/contact" className="text-green-600 font-medium hover:underline">Contact Us</a>
          </div>

          {/* User Guide Card */}
          <div className="bg-white shadow-lg rounded-xl overflow-hidden text-center p-6">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">User Guide</h3>
            <p className="text-gray-600 mb-4 text-sm">Learn how to use our platform</p>
            <a href="#guide" className="text-purple-600 font-medium hover:underline">Read Guide</a>
          </div>
        </div>

        {/* FAQs */}
        <div id="faqs" className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-white shadow-md rounded-lg overflow-hidden">
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full flex justify-between items-center text-left p-6"
                >
                  <h3 className="text-lg font-semibold text-gray-900">{faq.question}</h3>
                  <svg
                    className={`w-5 h-5 text-gray-500 transition-transform duration-300 ${openFaq === index ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                <div
                  className={`overflow-hidden transition-all duration-300 ease-in-out ${openFaq === index ? 'max-h-96' : 'max-h-0'}`}
                >
                  <p className="text-gray-600 p-6 pt-0">{faq.answer}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* User Guide */}
        <div id="guide" className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Getting Started Guide</h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            {/* Venue Owners Guide */}
            <div className="bg-white shadow-lg rounded-xl overflow-hidden p-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4">For Venue Owners</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-sm font-bold text-blue-600">1</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Create Account</h4>
                    <p className="text-sm text-gray-600">Sign up with your business details and verify your email</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-sm font-bold text-blue-600">2</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">List Your Venue</h4>
                    <p className="text-sm text-gray-600">Add venue details, photos, and pricing information</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-sm font-bold text-blue-600">3</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Start Receiving Bookings</h4>
                    <p className="text-sm text-gray-600">Manage bookings and payments through your dashboard</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Customers Guide */}
            <div className="bg-white shadow-lg rounded-xl overflow-hidden p-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4">For Customers</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-sm font-bold text-green-600">1</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Browse Venues</h4>
                    <p className="text-sm text-gray-600">Search and filter venues by location, capacity, and price</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-sm font-bold text-green-600">2</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Book Your Venue</h4>
                    <p className="text-sm text-gray-600">Select your preferred date and make a secure payment</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-sm font-bold text-green-600">3</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Enjoy Your Event</h4>
                    <p className="text-sm text-gray-600">Receive confirmation and enjoy your perfect venue</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Support Contact */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Still Need Help?</h3>
            <p className="text-gray-600 mb-6">Our support team is here to help you</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="/contact" className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-semibold text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                Contact Support
              </a>
              <a href="tel:+919831511897" className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-semibold text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 bg-gray-100 text-gray-700 hover:bg-gray-200 focus:ring-gray-500">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                Call Now (+91 98315 11897)
              </a>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}