import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/docs", "/docs/check-games", "/docs/list-games", "/login", "/register"],
        disallow: ["/dashboard", "/admin", "/api"],
      },
    ],
    sitemap: "https://mylix.app/sitemap.xml",
  };
}
