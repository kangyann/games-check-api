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
  title: {
    default: "Mylix App - Game Account Validation API",
    template: "%s | Mylix App",
  },
  applicationName: "Mylix App",
  description:
    "Validate game user accounts instantly with Mylix API. Supports Mobile Legends, Free Fire, and more. Developer-friendly REST API with dashboard and usage monitoring.",
  keywords: [
    "mylix app api",
    "game checker",
    "game account validation",
    "game validation api",
    "mylix app",
    "api validasi user game",
    "mylix api games",
    "game id checker api",
    "user id validation api",
    "gaming api provider",
    "mobile legends api checker",
    "free fire api checker",
    "api validasi game",
    "cek id game",
    "cek nickname game",
  ],
  authors: [{ name: "kangyann", url: "https://mylix.app" }],
  creator: "Mylix",
  robots: "index, follow",
  openGraph: {
    title: "Mylix App - Game Account Validation API",
    description:
      "Developer-friendly API to validate game user accounts in real-time. Dashboard, API keys, usage monitoring, and interactive docs included.",
    url: "https://mylix.app",
    siteName: "Mylix App",
    images: [
      {
        url: "https://mylix.app/icon.png",
        width: 1200,
        height: 630,
        alt: "Mylix App - Game Account Validation API",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Mylix App - Game Account Validation API",
    description:
      "Validate game accounts instantly. REST API with dashboard, rate limiting, and interactive documentation.",
    images: ["https://mylix.app/icon.png"],
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
                description:
                  "Developer-friendly API platform for game account validation.",
              },
              {
                "@context": "https://schema.org",
                "@type": "WebSite",
                name: "Mylix App",
                url: "https://mylix.app",
                description:
                  "Validate game user accounts instantly with Mylix API. Supports Mobile Legends, Free Fire, and more.",
              },
              {
                "@context": "https://schema.org",
                "@type": "WebApplication",
                name: "Mylix App",
                url: "https://mylix.app",
                applicationCategory: "DeveloperApplication",
                operatingSystem: "All",
                description:
                  "REST API for real-time game account validation with developer dashboard, API key management, and usage monitoring.",
                offers: {
                  "@type": "Offer",
                  price: "0",
                  priceCurrency: "USD",
                  description: "Free tier with 1000 requests/day",
                },
                featureList: [
                  "Game account validation API",
                  "Developer dashboard",
                  "API key management",
                  "Usage monitoring & rate limiting",
                  "Interactive API documentation",
                ],
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
