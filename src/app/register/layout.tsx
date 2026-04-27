import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create Account",
  description:
    "Register for a free Mylix App account. Get API keys to validate game user accounts for Mobile Legends, Free Fire, and more.",
  openGraph: {
    title: "Create Account | Mylix App",
    description: "Create your Mylix account and start validating game user accounts with our API.",
  },
};

export default function RegisterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
