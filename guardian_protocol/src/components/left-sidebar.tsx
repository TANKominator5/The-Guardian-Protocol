"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  AlertTriangle,
  Clock,
  Shield,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from "@/lib/supabase";
import { Button } from "./ui/button";

const navItems = [
  {
    label: "Dashboard",
    href: "/",
    icon: LayoutDashboard,
  },
  {
    label: "Entities",
    href: "/entities",
    icon: Users,
  },
  {
    label: "Timeline",
    href: "/timeline",
    icon: Clock,
  },
  {
    label: "Alerts",
    href: "/alerts",
    icon: AlertTriangle,
  },
];

export function LeftSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/auth/signin');
  };

  return (
    <aside className="w-64 border-r border-border bg-sidebar flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center gap-2">
          <Shield className="w-6 h-6 text-primary" />
          <div>
            <h1 className="font-bold text-lg text-sidebar-foreground">
              Campus Security
            </h1>
            <p className="text-xs text-sidebar-foreground/60">
              entry Resolution
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-2 rounded-lg transition-colors",
                isActive
                  ? "bg-sidebar-primary text-sidebar-primary-foreground"
                  : "text-sidebar-foreground hover:bg-sidebar-accent"
              )}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-sidebar-border space-y-3">
        <Button 
          onClick={handleLogout}
          variant="ghost"
          className="w-full justify-start gap-3 text-sidebar-foreground hover:bg-sidebar-accent"
        >
          <LogOut className="w-5 h-5" />
          <span>Logout</span>
        </Button>
        <p className="text-xs text-sidebar-foreground/60">
          Campus Security System v1.0
        </p>
      </div>
    </aside>
  );
}
