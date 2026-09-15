import type { MetadataRoute } from "next";

const APP_URL = process.env.APP_URL || "https://tuprofesorparticular.es";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/panel/", "/admin/", "/api/"],
    },
    sitemap: `${APP_URL}/sitemap.xml`,
  };
}
