import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Check Games API",
  description:
    "Validate game user accounts with the check-games endpoint. Supports Mobile Legends, Free Fire, and more. Requires API key authentication.",
  openGraph: {
    title: "Check Games API | Mylix App",
    description:
      "POST endpoint to validate game user accounts by User ID and Server ID. Interactive playground included.",
    url: "https://mylix.app/docs/check-games",
  },
  alternates: {
    canonical: "https://mylix.app/docs/check-games",
  },
};

export default function CheckGamesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
