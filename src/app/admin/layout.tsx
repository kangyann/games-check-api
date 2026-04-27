import type { Metadata } from "next";
import AdminClientLayout from "./admin-client-layout";

export const metadata: Metadata = {
  title: "Admin Dashboard",
  description:
    "Mylix App admin panel. Manage users, monitor API usage, send notifications, view transactions, and check system health.",
  robots: "noindex, nofollow",
  openGraph: {
    title: "Admin Dashboard | Mylix App",
    description:
      "Admin panel for Mylix App. User management, API monitoring, notifications, and system health.",
    url: "https://mylix.app/admin",
  },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AdminClientLayout>{children}</AdminClientLayout>;
}
