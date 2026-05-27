"use client";

import { useEffect } from "react";
import type { ProjectVideo } from "@/types";

declare global {
  interface Window {
    instgrm?: { Embeds: { process(): void } };
  }
}

export function VideoEmbed({ video }: { video: ProjectVideo }) {
  useEffect(() => {
    if (document.getElementById("instagram-embed-script")) {
      window.instgrm?.Embeds.process();
    } else {
      const s = document.createElement("script");
      s.id = "instagram-embed-script";
      s.src = "https://www.instagram.com/embed.js";
      s.async = true;
      document.body.appendChild(s);
    }
  }, []);

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
