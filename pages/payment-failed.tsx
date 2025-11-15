import Link from "next/link";

export default function PaymentFailed() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center px-4">
      <div className="card max-w-md w-full text-center">
        <div className="card-body">
          <div className="w-16 h-16 rounded-full bg-red-100 text-red-600 mx-auto flex items-center justify-center mb-4">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/></svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Payment Failed</h1>
          <p className="text-gray-600 mb-6">Your payment could not be completed. Please try again.</p>
          <div className="flex gap-3 justify-center">
            <Link href="/pricing" className="btn btn-secondary">Try Again</Link>
            <Link href="/contact" className="btn btn-primary">Contact Support</Link>
          </div>
        </div>
      </div>
    </div>
  );
}





