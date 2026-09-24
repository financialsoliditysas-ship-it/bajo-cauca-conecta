import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const base = "https://mercau.co";
  return {
    rules: {
      userAgent: "*",
      allow: ["/"],
      disallow: ["/api/"],
    },
    sitemap: `${base}/sitemap.xml`,
  };
}
