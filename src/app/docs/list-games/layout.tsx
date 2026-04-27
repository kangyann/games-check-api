import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "List Games API",
  description:
    "Get a list of all supported games on the Mylix API. Returns game names, prefixes, and codes for use with the check-games endpoint.",
  openGraph: {
    title: "List Games API | Mylix App",
    description:
      "GET endpoint to retrieve all supported game types for the Mylix validation API.",
    url: "https://mylix.app/docs/list-games",
  },
  alternates: {
    canonical: "https://mylix.app/docs/list-games",
  },
};

export default function ListGamesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
