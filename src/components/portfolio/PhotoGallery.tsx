"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Lightbox } from "./Lightbox";
import type { Photo, ProjectVideo } from "@/types";

declare global {
  interface Window {
    instgrm?: { Embeds: { process(): void } };
  }
}

type MediaItem =
  | { type: "photo"; item: Photo }
  | { type: "video"; item: ProjectVideo };

interface Props {
  photos: Photo[];
  videos?: ProjectVideo[];
}

export function PhotoGallery({ photos, videos = [] }: Props) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const mediaItems: MediaItem[] = [
    ...photos.map((p) => ({ type: "photo" as const, item: p })),
    ...videos.map((v) => ({ type: "video" as const, item: v })),
  ].sort((a, b) => a.item.display_order - b.item.display_order);

  const sortedPhotos = photos.slice().sort((a, b) => a.display_order - b.display_order);

  useEffect(() => {
    if (videos.length === 0) return;
    if (document.getElementById("instagram-embed-script")) {
      window.instgrm?.Embeds.process();
    } else {
      const s = document.createElement("script");
      s.id = "instagram-embed-script";
      s.src = "https://www.instagram.com/embed.js";
      s.async = true;
      document.body.appendChild(s);
    }
  }, [videos.length]);

  if (mediaItems.length === 0) {
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
        {mediaItems.map((media) => {
          if (media.type === "video") {
            return (
              <div key={`v-${media.item.id}`} className="break-inside-avoid">
                <blockquote
                  className="instagram-media"
                  data-instgrm-permalink={media.item.url}
                  data-instgrm-version="14"
                  style={{ maxWidth: 540, minWidth: 326, width: "calc(100% - 2px)" }}
                >
                  <a href={media.item.url} target="_blank" rel="noreferrer">
                    {media.item.title ?? "Veure a Instagram"}
                  </a>
                </blockquote>
              </div>
            );
          }

          const photoIdx = sortedPhotos.findIndex((p) => p.id === media.item.id);

          return (
            <button
              key={`p-${media.item.id}`}
              onClick={() => setLightboxIndex(photoIdx)}
              className="group relative block w-full overflow-hidden rounded-sm bg-neutral-900 break-inside-avoid cursor-zoom-in"
            >
              <Image
                src={media.item.url}
                alt={media.item.alt_text ?? ""}
                width={800}
                height={600}
                className="w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                priority={photoIdx < 3}
                placeholder="blur"
                blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=="
              />
              <div className="absolute inset-0 bg-white/0 group-hover:bg-white/5 transition-colors duration-300" />
            </button>
          );
        })}
      </div>

      {lightboxIndex !== null && (
        <Lightbox
          photos={sortedPhotos}
          index={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
          onPrev={() => setLightboxIndex((i) => Math.max(0, (i ?? 0) - 1))}
          onNext={() =>
            setLightboxIndex((i) => Math.min(sortedPhotos.length - 1, (i ?? 0) + 1))
          }
        />
      )}
    </>
  );
}
