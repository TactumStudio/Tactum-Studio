"use client";

import { useState, useTransition } from "react";
import { addProjectVideo, deleteProjectVideo } from "@/app/admin/photos/actions";
import type { ProjectVideo } from "@/types";

function isValidVideoUrl(url: string): boolean {
  return (
    /instagram\.com\/(p|reel|tv)\//.test(url) ||
    /(?:youtube\.com\/(?:watch\?v=|shorts\/)|youtu\.be\/)/.test(url)
  );
}

function getVideoPlatform(url: string): "youtube" | "instagram" {
  if (/youtube\.com|youtu\.be/.test(url)) return "youtube";
  return "instagram";
}

interface Props {
  projectId: string;
  projectSlug: string;
  videos: ProjectVideo[];
}

export function VideoManager({ projectId, projectSlug, videos }: Props) {
  const [url, setUrl] = useState("");
  const [title, setTitle] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleAdd(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    if (!isValidVideoUrl(url)) {
      setError(
        "URL no vàlida. Enganxa un link d'Instagram (post, reel, IGTV) o de YouTube (vídeo o short)."
      );
      return;
    }
    startTransition(async () => {
      try {
        await addProjectVideo(projectId, url, title, projectSlug);
        setUrl("");
        setTitle("");
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error en afegir el vídeo");
      }
    });
  }

  function handleDelete(id: string) {
    startTransition(async () => {
      await deleteProjectVideo(id, projectSlug);
    });
  }

  const inputClass =
    "bg-white border border-neutral-200 text-neutral-900 rounded-sm px-3 py-2 text-sm outline-none focus:border-neutral-400 transition-colors placeholder:text-neutral-400";

  return (
    <div className="space-y-6">
      {/* Formulari afegir vídeo */}
      <form onSubmit={handleAdd} className="flex flex-col gap-3">
        {error && <p className="text-red-500 text-xs">{error}</p>}
        <div className="flex flex-col gap-1">
          <label className="text-xs text-neutral-500">
            URL d&apos;Instagram o YouTube *
          </label>
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            required
            placeholder="https://www.instagram.com/reel/ABC123/ o https://youtu.be/ABC123"
            className={inputClass}
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs text-neutral-500">Títol — opcional</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Ex: Campanya Primavera"
            className={inputClass}
          />
        </div>
        <div>
          <button
            type="submit"
            disabled={isPending || !url}
            className="bg-white text-black border border-neutral-200 rounded-sm px-4 py-2 text-xs font-medium hover:bg-neutral-100 transition-colors disabled:opacity-50"
          >
            {isPending ? "Afegint..." : "Afegir vídeo"}
          </button>
        </div>
      </form>

      {/* Llista de vídeos */}
      {videos.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs tracking-widest uppercase text-neutral-500">
            Vídeos afegits
          </p>
          {videos.map((video) => {
            const platform = getVideoPlatform(video.url);
            return (
              <div
                key={video.id}
                className="flex items-center justify-between gap-4 px-3 py-2.5 bg-white border border-neutral-200 rounded-sm"
              >
                <div className="flex items-center gap-3 min-w-0">
                  {platform === "youtube" ? (
                    <svg
                      className="w-4 h-4 text-neutral-400 shrink-0"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                    </svg>
                  ) : (
                    <svg
                      className="w-4 h-4 text-neutral-400 shrink-0"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                    </svg>
                  )}
                  <div className="min-w-0">
                    {video.title && (
                      <p className="text-sm text-neutral-900 truncate">{video.title}</p>
                    )}
                    <p className="text-xs text-neutral-400 truncate">{video.url}</p>
                  </div>
                </div>
                <button
                  onClick={() => handleDelete(video.id)}
                  disabled={isPending}
                  className="shrink-0 text-xs text-neutral-400 hover:text-red-500 transition-colors disabled:opacity-50"
                >
                  Eliminar
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
