"use client";

import { useRef, useState, useTransition } from "react";
import Image from "next/image";
import { updateCoverImage } from "@/app/admin/projects/actions";

interface Props {
  projectId: string;
  currentUrl: string | null;
}

export function CoverImageUpload({ projectId, currentUrl }: Props) {
  const [preview, setPreview] = useState<string | null>(currentUrl);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    // Preview inmediato
    const blobUrl = URL.createObjectURL(file);
    setPreview(blobUrl);
    setError(null);

    startTransition(async () => {
      try {
        const presignRes = await fetch("/api/upload/presign", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            filename: file.name,
            contentType: file.type,
            folder: "project-covers",
          }),
        });

        if (!presignRes.ok) throw new Error("Error al preparar la subida");
        const { signedUrl, publicUrl } = await presignRes.json();

        const uploadRes = await fetch(signedUrl, {
          method: "PUT",
          body: file,
          headers: { "Content-Type": file.type },
        });

        if (!uploadRes.ok) throw new Error("Error al subir a R2");

        await updateCoverImage(projectId, publicUrl);
        setPreview(publicUrl);
        URL.revokeObjectURL(blobUrl);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error");
        setPreview(currentUrl);
      }
    });
  }

  return (
    <div className="relative group w-10 h-10 shrink-0">
      {/* Thumbnail o placeholder */}
      <div className="w-10 h-10 rounded-sm overflow-hidden bg-neutral-100 border border-neutral-200 flex items-center justify-center">
        {preview ? (
          <Image
            src={preview}
            alt=""
            width={40}
            height={40}
            className="object-cover w-full h-full"
            unoptimized={preview.startsWith("blob:")}
          />
        ) : (
          <svg
            className="w-4 h-4 text-neutral-700"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
        )}
      </div>

      {/* Overlay con botón de editar */}
      <label
        className={`absolute inset-0 flex items-center justify-center rounded-sm cursor-pointer transition-opacity
          ${isPending ? "bg-black/60" : "bg-black/0 group-hover:bg-black/60 opacity-0 group-hover:opacity-100"}`}
        title="Canviar portada"
      >
        {isPending ? (
          <div className="w-3 h-3 border border-white/30 border-t-white rounded-full animate-spin" />
        ) : (
          <svg
            className="w-4 h-4 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
        )}
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/avif"
          onChange={handleFileChange}
          disabled={isPending}
          className="hidden"
        />
      </label>

      {/* Error tooltip */}
      {error && (
        <div className="absolute top-full left-0 mt-1 bg-red-900 text-red-200 text-[9px] px-1.5 py-1 rounded-sm whitespace-nowrap z-10">
          {error}
        </div>
      )}
    </div>
  );
}
