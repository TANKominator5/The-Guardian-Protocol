"use client";

import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabase";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  ArrowRight,
  Shield,
  Network,
  AlertCircle,
  Zap,
  Eye,
  Lock,
} from "lucide-react";

export default function LandingPage() {
  const router = useRouter();
  const [hoveredFeature, setHoveredFeature] = useState<number | null>(null);

  useEffect(() => {
    const checkSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session) {
        router.push("/");
      }
    };
    checkSession();
  }, [router]);

  const handleGetStarted = () => {
    router.push("/auth/signin");
  };

  const features = [
    {
      icon: Network,
      title: "Entity Resolution",
      description:
        "Unify identities across swipe logs, Wi-Fi, CCTV, and text notes using AI-powered similarity matching",
    },
    {
      icon: Eye,
      title: "Timeline Reconstruction",
      description:
        "Reconstruct complete activity timelines with cross-source linking and chronological fusion",
    },
    {
      icon: AlertCircle,
      title: "Intelligent Alerts",
      description:
        "Real-time alerts with confidence scoring and explainability metadata for security events",
    },
    {
      icon: Zap,
      title: "Predictive Inference",
      description:
        "ML-powered predictions for missing activity states and likely current locations",
    },
    {
      icon: Lock,
      title: "Privacy-First Design",
      description:
        "Face vectors hashed before matching with privacy-aware data handling",
    },
    {
      icon: Shield,
      title: "Unified Dashboard",
      description:
        "Intuitive interface with dropdown queries, color-coded logs, and alert visualization",
    },
  ];

  const stats = [
    { label: "Data Sources", value: "5+" },
    { label: "Confidence Threshold", value: "85%" },
    { label: "Alert Response", value: "Real-time" },
    { label: "Privacy Compliance", value: "100%" },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 border-b border-border bg-background/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="w-6 h-6 text-accent" />
            <span className="text-xl font-bold">Guardian Protocol</span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <a
              href="#features"
              className="text-sm text-muted-foreground hover:text-foreground transition"
            >
              Features
            </a>
            <a
              href="#how-it-works"
              className="text-sm text-muted-foreground hover:text-foreground transition"
            >
              How It Works
            </a>
            <a
              href="#stats"
              className="text-sm text-muted-foreground hover:text-foreground transition"
            >
              Impact
            </a>
          </div>
          <Button
            className="bg-accent hover:bg-accent/90 text-accent-foreground"
            onClick={handleGetStarted}
          >
            Get Started
          </Button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="inline-block px-4 py-2 rounded-full bg-accent/10 border border-accent/30">
                <span className="text-sm font-medium text-accent">
                  AI-Powered Campus Security
                </span>
              </div>
              <h1 className="text-5xl lg:text-6xl font-bold leading-tight text-balance">
                Unified Campus Security Through{" "}
                <span className="text-accent">Entity Resolution</span>
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Transform fragmented security logs into actionable intelligence.
                Our AI system unifies identities across multiple data sources,
                reconstructs timelines, and raises intelligent alerts with
                explainability.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Button
                  size="lg"
                  className="bg-accent hover:bg-accent/90 text-accent-foreground"
                  onClick={handleGetStarted}
                >
                  Launch Dashboard <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-border hover:bg-card bg-transparent"
                >
                  View Demo
                </Button>
              </div>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-linear-to-r from-accent/20 to-primary/20 rounded-2xl blur-3xl"></div>
              <Card className="relative bg-card/50 border-border p-8 backdrop-blur-sm">
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-background/50">
                    <div className="w-2 h-2 rounded-full bg-accent animate-pulse"></div>
                    <span className="text-sm font-mono">
                      Entity E-134 Linked
                    </span>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between text-muted-foreground">
                      <span>Name Similarity</span>
                      <span className="text-accent">92%</span>
                    </div>
                    <div className="h-1 bg-background rounded-full overflow-hidden">
                      <div className="h-full w-[92%] bg-accent rounded-full"></div>
                    </div>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between text-muted-foreground">
                      <span>Device Correlation</span>
                      <span className="text-accent">100%</span>
                    </div>
                    <div className="h-1 bg-background rounded-full overflow-hidden">
                      <div className="h-full w-full bg-accent rounded-full"></div>
                    </div>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between text-muted-foreground">
                      <span>Face Embedding Match</span>
                      <span className="text-accent">88%</span>
                    </div>
                    <div className="h-1 bg-background rounded-full overflow-hidden">
                      <div className="h-full w-[88%] bg-accent rounded-full"></div>
                    </div>
                  </div>
                  <div className="pt-4 border-t border-border">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">
                        Final Confidence
                      </span>
                      <span className="text-lg font-bold text-accent">89%</span>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section
        id="stats"
        className="py-16 px-4 sm:px-6 lg:px-8 border-y border-border"
      >
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, idx) => (
              <div key={idx} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-accent mb-2">
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Powerful Features</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Everything you need to unify campus security and respond to
              incidents with confidence
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, idx) => {
              const Icon = feature.icon;
              return (
                <Card
                  key={idx}
                  className="group relative bg-card/50 border-border hover:border-accent/50 transition-all duration-300 p-6 cursor-pointer"
                  onMouseEnter={() => setHoveredFeature(idx)}
                  onMouseLeave={() => setHoveredFeature(null)}
                >
                  <div className="absolute inset-0 bg-linear-to-br from-accent/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-lg"></div>
                  <div className="relative">
                    <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center mb-4 group-hover:bg-accent/20 transition-colors">
                      <Icon className="w-6 h-6 text-accent" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section
        id="how-it-works"
        className="py-20 px-4 sm:px-6 lg:px-8 bg-card/30 border-y border-border"
      >
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold mb-16 text-center">How It Works</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                step: 1,
                title: "Data Ingestion",
                desc: "Collect logs from swipe cards, Wi-Fi, CCTV, and text notes",
              },
              {
                step: 2,
                title: "Entity Resolution",
                desc: "Match identities using fuzzy matching and embeddings",
              },
              {
                step: 3,
                title: "Timeline Fusion",
                desc: "Reconstruct complete activity timelines chronologically",
              },
              {
                step: 4,
                title: "Alert & Predict",
                desc: "Generate alerts and predict likely current locations",
              },
            ].map((item, idx) => (
              <div key={idx} className="relative">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-10 h-10 rounded-full bg-accent text-accent-foreground flex items-center justify-center font-bold text-sm">
                    {item.step}
                  </div>
                  {idx < 3 && (
                    <div className="hidden lg:block absolute left-[60px] top-5 w-[calc(100%-80px)] h-0.5 bg-linear-to-r from-accent to-transparent"></div>
                  )}
                </div>
                <h3 className="font-semibold mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">
            Ready to Secure Your Campus?
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            Deploy Guardian Protocol today and transform your security
            operations with AI-powered entity resolution
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-accent hover:bg-accent/90 text-accent-foreground"
              onClick={handleGetStarted}
            >
              Start Free Trial <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-border hover:bg-card bg-transparent"
            >
              Schedule Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-12 px-4 sm:px-6 lg:px-8 bg-card/30">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Shield className="w-5 h-5 text-accent" />
                <span className="font-bold">Guardian Protocol</span>
              </div>
              <p className="text-sm text-muted-foreground">
                AI-powered campus security system
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a href="#" className="hover:text-foreground transition">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition">
                    Pricing
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition">
                    Security
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a href="#" className="hover:text-foreground transition">
                    About
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition">
                    Contact
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a href="#" className="hover:text-foreground transition">
                    Privacy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition">
                    Terms
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition">
                    Compliance
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-muted-foreground">
            <p>&copy; 2025 Guardian Protocol. All rights reserved.</p>
            <div className="flex gap-6 mt-4 md:mt-0">
              <a href="#" className="hover:text-foreground transition">
                Twitter
              </a>
              <a href="#" className="hover:text-foreground transition">
                LinkedIn
              </a>
              <a href="#" className="hover:text-foreground transition">
                GitHub
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
