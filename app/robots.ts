import type { MetadataRoute } from "next";

const disallowedPaths = ["/dashboard", "/login", "/api/"];
const allowedAiCrawlers = ["GPTBot", "PerplexityBot", "ClaudeBot", "Google-Extended"];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: disallowedPaths,
      },
      ...allowedAiCrawlers.map((userAgent) => ({
        userAgent,
        allow: "/",
        disallow: disallowedPaths,
      })),
    ],
    sitemap: "https://nara-agency.vercel.app/sitemap.xml",
    host: "nara-agency.vercel.app",
  };
}
