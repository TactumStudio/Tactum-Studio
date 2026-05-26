"use client";

import { useState } from "react";
import Image from "next/image";
import { Lightbox } from "./Lightbox";
import type { Photo } from "@/types";

export function PhotoGallery({ photos }: { photos: Photo[] }) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  if (!photos || photos.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 border border-dashed border-white/10">
        <p className="text-neutral-600 text-xs tracking-widest uppercase">
          No hay fotos en este proyecto
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="columns-1 sm:columns-2 lg:columns-3 gap-3 space-y-3">
        {photos.map((photo, i) => (
          <button
            key={photo.id}
            onClick={() => setLightboxIndex(i)}
            className="group relative block w-full overflow-hidden rounded-sm bg-neutral-900 break-inside-avoid cursor-zoom-in"
          >
            <Image
              src={photo.url}
              alt={photo.alt_text ?? ""}
              width={800}
              height={600}
              className="w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              priority={i < 3}
            />
            {/* Overlay sutil en hover */}
            <div className="absolute inset-0 bg-white/0 group-hover:bg-white/5 transition-colors duration-300" />
          </button>
        ))}
      </div>

      {lightboxIndex !== null && (
        <Lightbox
          photos={photos}
          index={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
          onPrev={() => setLightboxIndex((i) => Math.max(0, (i ?? 0) - 1))}
          onNext={() =>
            setLightboxIndex((i) => Math.min(photos.length - 1, (i ?? 0) + 1))
          }
        />
      )}
    </>
  );
}
