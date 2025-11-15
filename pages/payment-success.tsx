import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect } from "react";

export default function PaymentSuccess() {
  const router = useRouter();
  useEffect(() => {
    const plan = (router.query?.plan as string) || '';
    const target = plan === 'elite' ? '/analytics' : '/';
    const t = setTimeout(() => router.replace(target), 1500);
    return () => clearTimeout(t);
  }, [router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center px-4">
      <div className="card max-w-md w-full text-center">
        <div className="card-body">
          <div className="w-16 h-16 rounded-full bg-green-100 text-green-600 mx-auto flex items-center justify-center mb-4">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/></svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Payment Successful</h1>
          <p className="text-gray-600 mb-6">Thank you! Redirecting...</p>
          <Link href="/analytics" className="btn btn-primary">Go to Analytics</Link>
        </div>
      </div>
    </div>
  );
}





