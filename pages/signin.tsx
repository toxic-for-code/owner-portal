"use client";
import { useState } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter } from "next/router";

export default function OwnerSignIn() {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const result = await signIn("credentials", {
      email: form.email,
      password: form.password,
      redirect: false,
    });
    if (result?.error) {
      setError("Invalid credentials or not an owner.");
    } else if (result?.ok) {
      router.push("/");
    } else {
      setError("Unknown error. Please try again.");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-8">
      <div className="w-full max-w-md">
        {/* Enhanced Card */}
        <div className="card fade-in">
          <div className="card-body p-8">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="flex justify-center mb-6">
                <div className="relative">
                  <img src="/logo.png" alt="WeEnYou Logo" width={64} height={64} className="h-16 w-16 object-contain" />
                </div>
              </div>
              <h1 className="text-3xl font-bold mb-2 text-gray-900">Welcome Back</h1>
              <p className="text-gray-600">Sign in to manage your halls and grow your business with WeEnYou!</p>
            </div>

            {/* Trust Indicators */}
            

            {/* Form */}
            <form className="space-y-6" onSubmit={handleSubmit}>
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
                  <svg className="w-5 h-5 text-red-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-red-700 text-sm">{error}</span>
                </div>
              )}

              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="Enter your email"
                  value={form.email}
                  onChange={handleChange}
                  className="input"
                  required
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  placeholder="Enter your password"
                  value={form.password}
                  onChange={handleChange}
                  className="input"
                  required
                />
              </div>

              <button
                type="submit"
                className={`btn btn-primary w-full py-4 text-lg ${loading ? 'loading' : ''}`}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <div className="loading-spinner"></div>
                    Signing in...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                    </svg>
                    Sign in as Owner
                  </>
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">or</span>
              </div>
            </div>

            {/* Sign Up Link */}
            <div className="text-center">
              <p className="text-gray-600 text-sm">
                New to WeEnYou?{' '}
                <Link href="/signup" className="text-blue-600 font-semibold hover:text-blue-700 hover:underline transition-colors">
                  Create an owner account
                </Link>
              </p>
            </div>
          </div>
        </div>

        {/* Additional Trust Elements */}
        <div className="mt-8 text-center">
          <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
              <span>Free to list</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <span>Secure payments</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
              <span>24/7 support</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 
