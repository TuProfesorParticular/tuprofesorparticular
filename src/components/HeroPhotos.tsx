import type { Vertical } from "@prisma/client";
import { VERTICAL_THEME } from "@/lib/constants";
import PhotoStrip from "@/components/PhotoStrip";

export default function HeroPhotos({ vertical }: { vertical: Vertical }) {
  const theme = VERTICAL_THEME[vertical];
  return <PhotoStrip query={theme.heroQuery} count={12} />;
}
