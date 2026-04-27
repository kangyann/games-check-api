import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign In",
  description:
    "Sign in to your Mylix App account. Access your dashboard, manage API keys, and monitor your game validation API usage.",
  openGraph: {
    title: "Sign In | Mylix App",
    description: "Sign in to access your Mylix API dashboard and manage your account.",
  },
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
