import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Authentication - Guardian Protocol",
  description: "Sign in or sign up to access Guardian Protocol",
};

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
