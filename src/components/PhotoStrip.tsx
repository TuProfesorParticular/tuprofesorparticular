import { getHeroPhotos } from "@/lib/pexels";
import HeroPhotoStrip from "@/components/HeroPhotoStrip";

// Tira de fotos genérica a partir de una búsqueda de Pexels — la usa tanto
// HeroPhotos (por ámbito, en la home) como cada página de categoría (por
// categoría, con su propia heroQuery), para que cada globo tenga su propia
// ambientación visual en vez de compartir siempre las mismas tres fotos.
export default async function PhotoStrip({
  query,
  count = 12,
}: {
  query: string;
  count?: number;
}) {
  const photos = await getHeroPhotos(query, count);
  return <HeroPhotoStrip photos={photos} />;
}
