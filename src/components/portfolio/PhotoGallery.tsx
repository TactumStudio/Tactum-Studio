"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Lightbox } from "./Lightbox";
import type { Photo, ProjectVideo } from "@/types";
import { getYouTubeId } from "@/lib/utils";

declare global {
  interface Window {
    instgrm?: { Embeds: { process(): void } };
  }
}

interface Props {
  photos: Photo[];
  videos?: ProjectVideo[];
}

export function PhotoGallery({ photos, videos = [] }: Props) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const sortedPhotos = photos.slice().sort((a, b) => a.display_order - b.display_order);
  const sortedVideos = videos.slice().sort((a, b) => a.display_order - b.display_order);

  const instagramVideos = sortedVideos.filter((v) => !getYouTubeId(v.url));
  const youtubeVideos = sortedVideos.filter((v) => !!getYouTubeId(v.url));

  const gridMedia = [
    ...sortedPhotos.map((p) => ({ type: "photo" as const, item: p })),
    ...instagramVideos.map((v) => ({ type: "video" as const, item: v })),
  ].sort((a, b) => a.item.display_order - b.item.display_order);

  const hasInstagram = instagramVideos.length > 0;

  useEffect(() => {
    if (!hasInstagram) return;
    if (document.getElementById("instagram-embed-script")) {
      window.instgrm?.Embeds.process();
    } else {
      const s = document.createElement("script");
      s.id = "instagram-embed-script";
      s.src = "https://www.instagram.com/embed.js";
      s.async = true;
      document.body.appendChild(s);
    }
  }, [hasInstagram]);

  if (gridMedia.length === 0 && youtubeVideos.length === 0) {
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
      {/* Grid fotos + vídeos Instagram mesclats per display_order */}
      {gridMedia.length > 0 && (
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-3 space-y-3">
          {gridMedia.map((media) => {
            if (media.type === "video") {
              return (
                <div key={`v-${media.item.id}`} className="break-inside-avoid max-w-[540px] mx-auto">
                  <blockquote
                    className="instagram-media"
                    data-instgrm-permalink={media.item.url}
                    data-instgrm-version="14"
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
      )}

      {/* Vídeos YouTube — sota, alineats a l'esquerra */}
      {youtubeVideos.length > 0 && (
        <div className="mt-16 pt-10 border-t border-neutral-800/20">
          <div className="flex flex-col gap-8 w-full lg:w-2/3">
            {youtubeVideos.map((video) => {
              const ytId = getYouTubeId(video.url)!;
              return (
                <div key={`v-${video.id}`}>
                  <div className="relative w-full aspect-video bg-neutral-900 rounded-sm overflow-hidden">
                    <iframe
                      src={`https://www.youtube.com/embed/${ytId}`}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="absolute inset-0 w-full h-full"
                      title={video.title ?? "YouTube"}
                    />
                  </div>
                  {video.title && (
                    <p className="text-xs text-neutral-500 mt-2">{video.title}</p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

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
