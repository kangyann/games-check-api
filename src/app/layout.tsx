import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Mylix App API - API Games Validation",
  description: "Use Mylix App API to check and validate game user accounts. It's free, public.",
  keywords: [
    "Mylix App API",
    "Game Checker",
    "Game Account Validation",
    "Free Game API",
    "Public Game API",
    "Nuvrify",
    "API for Developer",
    "Open Source Program",
    "Mylix App",
  ],
  authors: [{ name: "kangyann", url: "https://mylix.app" }],
  creator: "Mylix",
  robots: "index, follow",
  openGraph: {
    title: "Mylix App API - Free Games Account Validation",
    description:
      "Check game user IDs easily with Mylix App API. No authentication required. Public and free to use.",
    url: "https://mylix.app",
    siteName: "Mylix App API",
    images: [
      {
        url: "https://mylix.app/icon.png",
        width: 1200,
        height: 630,
        alt: "Mylix App API"
      }
    ],
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: "Mylix App API - Free Games Account Validation",
    description:
      "Public API to check game user accounts without login or API key.",
    images: ["https://mylix.app/icon.png"]
  },
  metadataBase: new URL("https://mylix.app")
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <link rel="icon" href="/icon.png" sizes="any" />
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased `}
      >
        {children}
      </body>
    </html>
  );
}
