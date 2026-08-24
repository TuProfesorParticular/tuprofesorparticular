import type { Vertical } from "@prisma/client";
import { getHeroPhotos } from "@/lib/pexels";
import { VERTICAL_THEME } from "@/lib/constants";
import HeroPhotoStrip from "@/components/HeroPhotoStrip";

export default async function HeroPhotos({ vertical }: { vertical: Vertical }) {
  const theme = VERTICAL_THEME[vertical];
  const photos = await getHeroPhotos(theme.heroQuery, 8);

  return <HeroPhotoStrip photos={photos} />;
}
