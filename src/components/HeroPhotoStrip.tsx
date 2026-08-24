"use client";

import { useEffect, useState } from "react";
import type { HeroPhoto } from "@/lib/pexels";

const INTERVAL_MS = 4000;
const SLOT_COUNT = 3;

function PhotoSlot({ photos }: { photos: HeroPhoto[] }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (photos.length <= 1) return;
    const timer = setInterval(() => {
      setIndex((i) => (i + 1) % photos.length);
    }, INTERVAL_MS);
    return () => clearInterval(timer);
  }, [photos.length]);

  return (
    <div className="relative aspect-[4/3] overflow-hidden rounded-2xl shadow-md">
      {photos.map((photo, i) => (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          key={photo.url}
          src={photo.url}
          alt={photo.alt}
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ${
            i === index ? "opacity-100" : "opacity-0"
          }`}
        />
      ))}
    </div>
  );
}

export default function HeroPhotoStrip({ photos }: { photos: HeroPhoto[] }) {
  if (photos.length === 0) return null;

  const slots = Array.from({ length: Math.min(SLOT_COUNT, photos.length) }, (_, i) =>
    photos.filter((_, idx) => idx % SLOT_COUNT === i),
  );

  return (
    <div className="mt-6 grid grid-cols-3 gap-1.5">
      {slots.map((slotPhotos, i) => (
        <PhotoSlot key={i} photos={slotPhotos} />
      ))}
    </div>
  );
}
