"use client";

import Image from "next/image";
import { useState, useRef } from "react";

interface Props {
  currentUrl: string | null;
}

export function HeroImageUploader({ currentUrl }: Props) {
  const [url, setUrl] = useState(currentUrl ?? "");
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFile(file: File) {
    setUploading(true);
    try {
      const res = await fetch("/api/upload/presign", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          filename: file.name,
          contentType: file.type,
          folder: "hero",
        }),
      });
      const { signedUrl, publicUrl } = await res.json();
      await fetch(signedUrl, {
        method: "PUT",
        body: file,
        headers: { "Content-Type": file.type },
      });
      setUrl(publicUrl);
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="space-y-3">
      <p className="text-[10px] tracking-[0.3em] uppercase text-neutral-500">
        Imatge de fons del hero
      </p>

      {/* Preview */}
      {url && (
        <div className="relative w-full aspect-video rounded overflow-hidden bg-neutral-100">
          <Image src={url} alt="Hero preview" fill className="object-cover" />
        </div>
      )}

      <div className="flex gap-3">
        <input
          type="hidden"
          name="hero_image_url"
          value={url}
        />
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleFile(file);
          }}
        />
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="px-4 py-2 text-xs tracking-widest uppercase border border-neutral-300 text-neutral-600 hover:border-neutral-600 hover:text-neutral-900 transition-colors rounded disabled:opacity-40"
        >
          {uploading ? "Pujant…" : url ? "Canviar imatge" : "Pujar imatge"}
        </button>
        {url && (
          <button
            type="button"
            onClick={() => setUrl("")}
            className="px-4 py-2 text-xs tracking-widest uppercase border border-neutral-200 text-neutral-500 hover:text-neutral-700 transition-colors rounded"
          >
            Eliminar
</button>
        )}
      </div>

      {/* También permite pegar URL directamente */}
      <input
        type="text"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        className="w-full bg-white border border-neutral-200 rounded px-3 py-2 text-xs text-neutral-700 placeholder-neutral-400 focus:outline-none focus:border-neutral-400 transition-colors"
        placeholder="O enganxa aquí la URL de la imatge…"
      />
    </div>
  );
}
