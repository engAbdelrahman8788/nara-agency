import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/dashboard", "/login", "/api/"],
      },
    ],
    sitemap: "https://nara-agency.vercel.app/sitemap.xml",
    host: "nara-agency.vercel.app",
  };
}
