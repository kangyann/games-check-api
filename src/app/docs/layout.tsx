import type { Metadata } from "next";
import DocsClientLayout from "./docs-client-layout";

export const metadata: Metadata = {
  title: "Documentation",
  description:
    "Mylix App API documentation. Learn how to integrate game account validation into your app with our REST API. Includes interactive playground, code examples, and endpoint references.",
  openGraph: {
    title: "API Documentation | Mylix App",
    description:
      "Complete API reference for Mylix game validation API. Interactive playground, code examples in cURL, JavaScript, and Python.",
    url: "https://mylix.app/docs",
  },
  alternates: {
    canonical: "https://mylix.app/docs",
  },
};

export default function DocsLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <DocsClientLayout>{children}</DocsClientLayout>;
}
