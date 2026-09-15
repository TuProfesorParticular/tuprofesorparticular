import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";
import { CATEGORIES } from "@/lib/constants";

const APP_URL = process.env.APP_URL || "https://tuprofesorparticular.es";

const STATIC_ROUTES = [
  "",
  "/materiales",
  "/preguntas-frecuentes",
  "/universidad",
  "/para-profesores",
  "/oportunidades",
  "/registro",
  "/iniciar-sesion",
  "/canal-etico",
  "/aviso-legal",
  "/terminos",
  "/privacidad",
  "/cookies",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const teachers = await prisma.teacherProfile.findMany({
    where: { status: "approved" },
    select: { id: true, createdAt: true },
  });

  return [
    ...STATIC_ROUTES.map((route) => ({
      url: `${APP_URL}${route}`,
      lastModified: new Date(),
    })),
    ...CATEGORIES.map((category) => ({
      url: `${APP_URL}/categoria/${encodeURIComponent(category.slug)}`,
      lastModified: new Date(),
    })),
    ...teachers.map((teacher) => ({
      url: `${APP_URL}/profesores/${teacher.id}`,
      lastModified: teacher.createdAt,
    })),
  ];
}
