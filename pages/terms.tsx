import Link from "next/link";

export default function Terms() {
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
              <span className="block text-xs text-gray-500">Terms of Service</span>
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
      <main className="max-w-3xl mx-auto px-4 py-12">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Terms of Service – WeEnYou Owner Portal</h1>
        <p className="text-gray-600 mb-6"><span className="font-semibold">Effective Date:</span> 16 October 2025</p>
        <p className="text-gray-700 mb-6">Welcome to the <span className="font-semibold">WeEnYou Owner Portal</span>. By accessing or using this portal, you agree to comply with these Terms of Service (“Terms”) and all applicable laws and regulations. If you do not agree, you must not use the portal.</p>

        <div className="h-px bg-gray-200 my-6" />

        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-900">1. Eligibility</h2>
          <p className="text-gray-700">To use the Owner Portal, you must:</p>
          <ul className="list-disc pl-6 text-gray-700 space-y-1">
            <li>Be at least 18 years old.</li>
            <li>Own or manage a banquet hall or event space.</li>
            <li>Provide accurate and complete information during registration.</li>
          </ul>
        </section>

        <div className="h-px bg-gray-200 my-6" />

        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-900">2. Account Registration</h2>
          <ul className="list-disc pl-6 text-gray-700 space-y-1">
            <li>Owners must create an account using a valid email address.</li>
            <li>You are responsible for maintaining the confidentiality of your login credentials.</li>
            <li>You agree to notify us immediately of any unauthorized use of your account.</li>
            <li>We reserve the right to suspend or terminate accounts for violation of these Terms.</li>
          </ul>
        </section>

        <div className="h-px bg-gray-200 my-6" />

        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-900">3. Owner Responsibilities</h2>
          <p className="text-gray-700">By using the Owner Portal, you agree to:</p>
          <ul className="list-disc pl-6 text-gray-700 space-y-1">
            <li>Provide truthful, accurate, and up-to-date information about your banquet hall.</li>
            <li>Respond to booking requests in a timely manner.</li>
            <li>Ensure your property complies with all local laws and regulations.</li>
            <li>Maintain the safety and quality standards of your listed space.</li>
          </ul>
        </section>

        <div className="h-px bg-gray-200 my-6" />

        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-900">4. Booking and Payments</h2>
          <ul className="list-disc pl-6 text-gray-700 space-y-1">
            <li>All bookings made through the portal are subject to confirmation by the owner.</li>
            <li>Payments for bookings will be processed through the portal’s payment system.</li>
            <li>We may charge applicable fees or commissions as disclosed in your account.</li>
            <li>Owners are responsible for accurate bank details to receive earnings.</li>
          </ul>
        </section>

        <div className="h-px bg-gray-200 my-6" />

        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-900">5. Prohibited Activities</h2>
          <p className="text-gray-700">You must not:</p>
          <ul className="list-disc pl-6 text-gray-700 space-y-1">
            <li>Use the portal for any illegal or unauthorized purpose.</li>
            <li>Post false, misleading, or offensive content.</li>
            <li>Attempt to hack, disrupt, or interfere with the portal or other users’ accounts.</li>
            <li>Use another person’s account without permission.</li>
          </ul>
        </section>

        <div className="h-px bg-gray-200 my-6" />

        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-900">6. Intellectual Property</h2>
          <ul className="list-disc pl-6 text-gray-700 space-y-1">
            <li>All content on the Owner Portal, including logos, text, images, and software, is owned by WeEnYou or its licensors.</li>
            <li>You may not reproduce, modify, distribute, or create derivative works without explicit permission.</li>
          </ul>
        </section>

        <div className="h-px bg-gray-200 my-6" />

        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-900">7. Privacy</h2>
          <p className="text-gray-700">Your use of the portal is also governed by our <Link href="/privacy" className="text-blue-600 hover:underline">Privacy Policy</Link>, which explains how we collect, use, and protect your information.</p>
        </section>

        <div className="h-px bg-gray-200 my-6" />

        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-900">8. Limitation of Liability</h2>
          <ul className="list-disc pl-6 text-gray-700 space-y-1">
            <li>We provide the portal “as is” without warranties of any kind.</li>
            <li>We are not responsible for disputes between owners and users, property damages, or financial losses.</li>
            <li>Liability for any claim arising from your use of the portal is limited to the amount you paid, if any, to use the service.</li>
          </ul>
        </section>

        <div className="h-px bg-gray-200 my-6" />

        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-900">9. Termination</h2>
          <ul className="list-disc pl-6 text-gray-700 space-y-1">
            <li>We may suspend or terminate your account at our discretion for violations of these Terms or illegal activity.</li>
            <li>Owners can close their accounts at any time by contacting support.</li>
          </ul>
        </section>

        <div className="h-px bg-gray-200 my-6" />

        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-900">10. Modifications to Terms</h2>
          <ul className="list-disc pl-6 text-gray-700 space-y-1">
            <li>We may update these Terms at any time.</li>
            <li>Changes will be posted on the portal with an updated effective date.</li>
            <li>Continued use of the portal constitutes acceptance of the updated Terms.</li>
          </ul>
        </section>

        <div className="h-px bg-gray-200 my-6" />

        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-900">11. Governing Law</h2>
          <p className="text-gray-700">These Terms are governed by the laws of India. Any disputes will be subject to the exclusive jurisdiction of courts located in your region.</p>
        </section>

        <div className="h-px bg-gray-200 my-6" />

        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-900">12. Contact Us</h2>
          <ul className="list-none pl-0 text-gray-700 space-y-1">
            <li><span className="font-semibold">Email:</span> <a className="text-blue-600 hover:underline" href="mailto:email-support@weenyou.com">email-support@weenyou.com</a></li>
            <li><span className="font-semibold">Phone:</span> +91 98315 11897</li>
            <li><span className="font-semibold">Address:</span> Maldah</li>
          </ul>
        </section>
      </main>
    </div>
  );
}





