"use client"
import { useEffect } from 'react';
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabase";
import { Card } from "../../components/ui/card";
import { Separator } from "../../components/ui/separator";

export default function LandingPage() {
  const router = useRouter();

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        router.push("/");
      }
    };
    checkSession();
  }, [router]);

  const handleGetStarted = () => {
    router.push("/auth/signin");
  };

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="relative z-10 flex items-center justify-center min-h-screen">
        <Card className="p-8 max-w-lg text-center bg-white/90 backdrop-blur-sm">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
            Welcome to The Guardian Protocol
          </h1>
          <p className="text-gray-600 mb-6">
            Your one-stop solution for managing alerts, entities, and timelines efficiently.
          </p>
          <Separator className="my-4" />
          <div className="mt-8 animate-float">
            <button
              onClick={handleGetStarted}
              className="relative group px-8 py-4 overflow-hidden font-medium text-white bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 hover:scale-105"
            >
              <span className="relative z-10 flex items-center gap-2">
                Get Started
                <svg 
                  className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24" 
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </span>
              <span className="absolute inset-0 w-full h-full bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
            </button>
          </div>
        </Card>
      </div>
    </div>
  );
}