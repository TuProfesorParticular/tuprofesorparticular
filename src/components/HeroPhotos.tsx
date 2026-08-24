import type { Vertical } from "@prisma/client";
import { getHeroPhotos } from "@/lib/pexels";
import { VERTICAL_THEME } from "@/lib/constants";
import HeroPhotoCarousel from "@/components/HeroPhotoCarousel";

export default async function HeroPhotos({ vertical }: { vertical: Vertical }) {
  const theme = VERTICAL_THEME[vertical];
  const photos = await getHeroPhotos(theme.heroQuery);

  if (photos.length === 0) return null;

  return <HeroPhotoCarousel photos={photos} heroWash={theme.heroWash} />;
}
