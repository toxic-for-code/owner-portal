import { SessionProvider } from "next-auth/react";
import type { AppProps } from "next/app";
import { ErrorBoundary } from "react-error-boundary";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useSession } from "next-auth/react";
import Head from "next/head";
import "../styles/globals.css";

// Error Fallback Component
function ErrorFallback({ error, resetErrorBoundary }: { error: Error; resetErrorBoundary: () => void }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Something went wrong</h1>
        <p className="text-gray-600 mb-6">We're sorry, but something unexpected happened. Please try again.</p>
        <button
          onClick={resetErrorBoundary}
          className="btn btn-primary"
        >
          Try Again
        </button>
      </div>
    </div>
  );
}

// Authentication Guard Component
function AuthGuard({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  
  // List of public routes that don't require authentication
  const publicRoutes = ['/', '/signin', '/signup', '/about', '/contact', '/help', '/analytics'];
  const isPublicRoute = publicRoutes.includes(router.pathname);
  
  useEffect(() => {
    // If not authenticated and trying to access a protected route
    if (status === 'unauthenticated' && !isPublicRoute) {
      router.push('/signin');
    }
  }, [session, status, router, isPublicRoute]);
  
  // Show loading while checking authentication
  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="loading-spinner mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }
  
  // If not authenticated and not on a public route, don't render children
  if (status === 'unauthenticated' && !isPublicRoute) {
    return null;
  }
  
  return <>{children}</>;
}

export default function App({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <SessionProvider session={session}>
        <AuthGuard>
          <Head>
            <title>Owner Portal</title>
            <meta name="og:title" content="Owner Portal" />
            <meta name="twitter:title" content="Owner Portal" />
            <link rel="icon" href="/logo.png" />
            <link rel="shortcut icon" href="/logo.png" type="image/png" />
          </Head>
          <Component {...pageProps} />
        </AuthGuard>
      </SessionProvider>
    </ErrorBoundary>
  );
}