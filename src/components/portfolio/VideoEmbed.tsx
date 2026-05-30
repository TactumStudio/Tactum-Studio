"use client";

import { useEffect } from "react";
import type { ProjectVideo } from "@/types";
import { getYouTubeId } from "@/lib/utils";

declare global {
  interface Window {
    instgrm?: { Embeds: { process(): void } };
  }
}

export function VideoEmbed({ video }: { video: ProjectVideo }) {
  const ytId = getYouTubeId(video.url);

  useEffect(() => {
    if (ytId) return;
    if (document.getElementById("instagram-embed-script")) {
      window.instgrm?.Embeds.process();
    } else {
      const s = document.createElement("script");
      s.id = "instagram-embed-script";
      s.src = "https://www.instagram.com/embed.js";
      s.async = true;
      document.body.appendChild(s);
    }
  }, [ytId]);

  if (ytId) {
    return (
      <div>
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
          <p className="text-xs text-neutral-500 text-center mt-2">{video.title}</p>
        )}
      </div>
    );
  }

  return (
    <div>
      <blockquote
        className="instagram-media"
        data-instgrm-permalink={video.url}
        data-instgrm-version="14"
        style={{
          maxWidth: 540,
          minWidth: 326,
          width: "calc(100% - 2px)",
        }}
      >
        <a href={video.url} target="_blank" rel="noreferrer">
          {video.title ?? "Veure a Instagram"}
        </a>
      </blockquote>
      {video.title && (
        <p className="text-xs text-neutral-500 text-center mt-2">{video.title}</p>
      )}
    </div>
  );
}
