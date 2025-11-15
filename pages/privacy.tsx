import Link from "next/link";

export default function Privacy() {
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
              <span className="block text-xs text-gray-500">Privacy Policy</span>
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
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Privacy Policy – WeEnYou Owner Portal</h1>
        <p className="text-gray-600 mb-6"><span className="font-semibold">Effective Date:</span> 16 October 2025</p>
        <p className="text-gray-700 mb-6">We at <span className="font-semibold">WeEnYou</span> value your privacy and are committed to protecting the personal information of our owners and users. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our Owner Portal.</p>

        <div className="h-px bg-gray-200 my-6" />

        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-900">1. Information We Collect</h2>
          <p className="text-gray-700">When you sign up and use the Owner Portal, we may collect the following types of information:</p>
          <div>
            <p className="font-semibold text-gray-900">a. Personal Information:</p>
            <ul className="list-disc pl-6 text-gray-700 space-y-1">
              <li>Name, email address, phone number, and address</li>
              <li>Business details including banquet hall name, location, and capacity</li>
              <li>Bank account or payment details for revenue settlement</li>
            </ul>
          </div>
          <div>
            <p className="font-semibold text-gray-900">b. Account Information:</p>
            <ul className="list-disc pl-6 text-gray-700 space-y-1">
              <li>Login credentials (username, password)</li>
              <li>Activity logs, including booking requests and interactions</li>
            </ul>
          </div>
          <div>
            <p className="font-semibold text-gray-900">c. Usage Information:</p>
            <ul className="list-disc pl-6 text-gray-700 space-y-1">
              <li>IP address, device type, browser type, and operating system</li>
              <li>Portal activity, pages visited, and session duration</li>
            </ul>
          </div>
        </section>

        <div className="h-px bg-gray-200 my-6" />

        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-900">2. How We Use Your Information</h2>
          <ul className="list-disc pl-6 text-gray-700 space-y-1">
            <li>Facilitate owner registration and verification</li>
            <li>Manage your banquet hall listings and bookings</li>
            <li>Process payments and earnings settlements</li>
            <li>Communicate important updates, notifications, and support responses</li>
            <li>Improve our services, portal functionality, and user experience</li>
            <li>Ensure compliance with legal obligations</li>
          </ul>
        </section>

        <div className="h-px bg-gray-200 my-6" />

        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-900">3. Information Sharing and Disclosure</h2>
          <p className="text-gray-700">We do <span className="font-semibold">not sell your personal information</span>. We may share your data only in the following cases:</p>
          <ul className="list-disc pl-6 text-gray-700 space-y-1">
            <li>With service providers for payment processing, hosting, or analytics</li>
            <li>To comply with legal requirements, enforce policies, or protect rights and safety</li>
            <li>In case of business transfers (e.g., mergers, acquisitions)</li>
          </ul>
        </section>

        <div className="h-px bg-gray-200 my-6" />

        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-900">4. Data Security</h2>
          <p className="text-gray-700">We implement appropriate technical and organizational measures to protect your information from unauthorized access, alteration, disclosure, or destruction. However, no system can guarantee absolute security.</p>
        </section>

        <div className="h-px bg-gray-200 my-6" />

        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-900">5. Your Rights</h2>
          <p className="text-gray-700">As an owner using our portal, you have the right to:</p>
          <ul className="list-disc pl-6 text-gray-700 space-y-1">
            <li>Access and update your personal information</li>
            <li>Request deletion of your account and data</li>
            <li>Opt out of marketing communications</li>
          </ul>
          <p className="text-gray-700">To exercise these rights, please contact us at <a className="text-blue-600 hover:underline" href="mailto:email-support@weenyou.com">email-support@weenyou.com</a>.</p>
        </section>

        <div className="h-px bg-gray-200 my-6" />

        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-900">6. Cookies and Tracking</h2>
          <p className="text-gray-700">We may use cookies and similar technologies to improve portal performance, understand user behavior, and personalize your experience. You can manage cookie preferences through your browser settings.</p>
        </section>

        <div className="h-px bg-gray-200 my-6" />

        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-900">7. Changes to This Privacy Policy</h2>
          <p className="text-gray-700">We may update this Privacy Policy from time to time. Any changes will be posted on this page with the <span className="font-semibold">effective date</span> updated. Continued use of the Owner Portal after updates constitutes acceptance of the updated policy.</p>
        </section>

        <div className="h-px bg-gray-200 my-6" />

        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-900">8. Contact Us</h2>
          <p className="text-gray-700">If you have questions or concerns about this Privacy Policy, you can reach us at:</p>
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





