"use client"
import React, { useEffect } from 'react';
import { Button } from "../../components/ui/button";
import { Card } from "../../components/ui/card";
import { Separator } from "../../components/ui/separator";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabase";

const LandingPage = () => {
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
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <Card className="p-8 max-w-lg text-center">
        <h1 className="text-4xl font-bold mb-4">Welcome to The Guardian Protocol</h1>
        <p className="text-gray-600 mb-6">
          Your one-stop solution for managing alerts, entities, and timelines efficiently.
        </p>
        <Separator className="my-4" />
        <Button onClick={handleGetStarted} className="w-full">
          Get Started
        </Button>
      </Card>
    </div>
  );
};

export default LandingPage;