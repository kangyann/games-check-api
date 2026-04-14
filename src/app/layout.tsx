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
  title: "Mylix App - Game Validation API & Game ID Checker",
  applicationName: "Mylix App",
  description: "Use Mylix App API to check and validate game user accounts. It's free, public.",
  keywords: [
    "mylix app api",
    "game checker",
    "game account validation",
    "free game api",
    "mylix app",
    "api validasi user game",
    "mylix api games",
    "mylix app game api",
    "Public Game API",
    "game validation api",
    "game id checker api",
    "user id validation api",
    "gaming api provider",
    "mobile legends api checker",
    "free fire api checker",
    "api validasi game",
  ],
  authors: [{ name: "kangyann", url: "https://mylix.app" }],
  creator: "Mylix",
  robots: "index, follow",
  openGraph: {
    title: "Mylix App API",
    description:
      "Free Game Validation API to check user IDs, nicknames, and accounts instantly. Built for developers.",
    url: "https://mylix.app",
    siteName: "Mylix App",
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
    title: "Mylix App - Free Games Account Validation",
    description:
      "Public API to check game user accounts without login or API key.",
    images: ["https://mylix.app/icon.png"]
  },
  metadataBase: new URL("https://mylix.app"),
  alternates: {
    canonical: "https://mylix.app",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify([
              {
                "@context": "https://schema.org",
                "@type": "Organization",
                name: "Mylix App",
                url: "https://mylix.app",
                logo: "https://mylix.app/icon.png",
              },
              {
                "@context": "https://schema.org",
                "@type": "WebSite",
                name: "Mylix App",
                url: "https://mylix.app",
              },
            ]),
          }}
        />
        <link rel="icon" href="/icon.png" sizes="any" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased `}
      >
        {children}
      </body>
    </html>
  );
}
