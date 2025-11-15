"use client";
import { useRouter } from "next/router";
import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";

export default function Checkout() {
  const router = useRouter();
  const { plan, amount } = router.query as { plan?: string; amount?: string };
  const [processing, setProcessing] = useState(false);

  const planLabel = useMemo(() => {
    if (!plan) return "";
    const p = plan.toLowerCase();
    if (p === "premium") return "Premium";
    if (p === "elite") return "Elite";
    return plan;
  }, [plan]);

  const formatINR = (value?: string) => {
    const n = Number(value || 0);
    return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);
  };

  const loadRazorpay = useCallback((): Promise<boolean> => {
    return new Promise((resolve) => {
      if (typeof window === 'undefined') return resolve(false);
      if ((window as any).Razorpay) return resolve(true);
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  }, []);

  const startPayment = async () => {
    if (!amount) return;
    setProcessing(true);
    const ok = await loadRazorpay();
    if (!ok) {
      router.replace({ pathname: "/payment-failed", query: { plan, amount } });
      return;
    }

    // Create Razorpay Order on server
    const resp = await fetch('/api/payments/razorpay/order', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount: Number(amount), plan })
    });
    if (!resp.ok) {
      router.replace({ pathname: "/payment-failed", query: { plan, amount } });
      return;
    }
    const { order, keyId } = await resp.json();

    const options: any = {
      key: keyId,
      amount: order.amount,
      currency: order.currency,
      name: 'WeEnYou',
      description: `${planLabel} Plan`,
      order_id: order.id,
      prefill: {},
      notes: { plan: planLabel },
      theme: { color: '#2563eb' },
      handler: async function (response: any) {
        // Verify signature on server
        const verify = await fetch('/api/payments/razorpay/verify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...response, plan })
        });
        if (verify.ok) {
          router.replace({ pathname: "/payment-success", query: { plan, amount } });
        } else {
          router.replace({ pathname: "/payment-failed", query: { plan, amount } });
        }
      },
      modal: {
        ondismiss: () => {
          router.replace({ pathname: "/payment-failed", query: { plan, amount } });
        }
      }
    };

    const rz = new (window as any).Razorpay(options);
    rz.open();
    setProcessing(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <nav className="w-full bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="WeEnYou Logo" width={40} height={40} className="h-10 w-10 object-contain" />
            <div>
              <span className="text-xl font-bold tracking-tight text-gray-900">WeEnYou</span>
              <span className="block text-xs text-gray-500">Checkout</span>
            </div>
          </div>
          <Link href="/pricing" className="btn btn-secondary">Back</Link>
        </div>
      </nav>

      <main className="max-w-3xl mx-auto px-4 py-12">
        <div className="card">
          <div className="card-body">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Confirm your plan</h1>
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-gray-600">Selected Plan</p>
                <p className="text-lg font-semibold text-gray-900">{planLabel || "-"}</p>
              </div>
              <div className="text-right">
                <p className="text-gray-600">Amount</p>
                <p className="text-lg font-semibold text-gray-900">{formatINR(amount)}</p>
              </div>
            </div>
            <button disabled={processing} onClick={startPayment} className="btn btn-primary w-full">
              {processing ? "Redirecting to payment..." : "Pay Now"}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}


