export type HeroPhoto = {
  url: string;
  alt: string;
};

export async function getHeroPhotos(
  query: string,
  count = 5,
): Promise<HeroPhoto[]> {
  const apiKey = process.env.PEXELS_API_KEY;
  if (!apiKey) return [];

  try {
    const response = await fetch(
      `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=${count}&orientation=landscape`,
      {
        headers: { Authorization: apiKey },
        next: { revalidate: 60 * 60 * 24 },
      },
    );

    if (!response.ok) return [];

    const data = (await response.json()) as {
      photos?: { src: { large: string }; alt?: string }[];
    };

    return (data.photos ?? []).map((photo) => ({
      url: photo.src.large,
      alt: photo.alt || "Profesor particular dando clase a un alumno",
    }));
  } catch {
    return [];
  }
}
