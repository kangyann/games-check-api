import type { Metadata } from "next";
import DashboardClientLayout from "./dashboard-client-layout";

export const metadata: Metadata = {
  title: "Dashboard",
  description:
    "Manage your Mylix API account. View usage stats, generate API keys, monitor rate limits, and manage your profile.",
  robots: "noindex, nofollow",
  openGraph: {
    title: "Dashboard | Mylix App",
    description:
      "Your Mylix API dashboard. Monitor usage, manage API keys, and view notifications.",
    url: "https://mylix.app/dashboard",
  },
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DashboardClientLayout>{children}</DashboardClientLayout>;
}
