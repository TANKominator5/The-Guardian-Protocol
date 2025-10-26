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
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-foreground"></div>
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  const isAuthPage = pathname?.startsWith('/auth');

  if (isAuthPage) {
    return <>{children}</>;
  }

  return (
    <div className="flex h-screen bg-background">
      <LeftSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">{children}</div>
    </div>
  );
}
