'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { LeftSidebar } from './left-sidebar';

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();

      const isAuthPage = pathname?.startsWith('/auth');
      const isLandingPage = pathname === '/landing';

      if (!session && !isAuthPage && !isLandingPage) {
        // Not logged in and trying to access a protected page
        router.push('/landing');
      } else if (session && (isAuthPage || isLandingPage)) {
        // Already logged in but on auth or landing page
        router.push('/');
      }

      setLoading(false);
    };

    checkAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      const isAuthPage = pathname?.startsWith('/auth');
      const isLandingPage = pathname === '/landing';

      if (event === 'SIGNED_IN' && (isAuthPage || isLandingPage)) {
        router.push('/');
        router.refresh();
      } else if (event === 'SIGNED_OUT' && !isAuthPage) {
        router.push('/landing');
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [router, pathname]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  const isAuthPage = pathname?.startsWith('/auth');
  const isLandingPage = pathname === '/landing';

  // For auth and landing pages, don't show the sidebar
  if (isAuthPage || isLandingPage) {
    return <div className="min-h-screen">{children}</div>;
  }

  // For all other authenticated pages, show the sidebar
  return (
    <div className="flex min-h-screen bg-background">
      <LeftSidebar />
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
