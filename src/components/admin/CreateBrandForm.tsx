"use client";

import { useRef, useState, useTransition } from "react";
import { createBrand } from "@/app/admin/brands/actions";

export function CreateBrandForm() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const formRef = useRef<HTMLFormElement>(null);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f);
    if (preview) URL.revokeObjectURL(preview);
    setPreview(URL.createObjectURL(f));
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    const formData = new FormData(e.currentTarget);
    const name = (formData.get("name") as string).trim() || null;
    const websiteUrl = (formData.get("website_url") as string).trim() || undefined;

    startTransition(async () => {
      try {
        let publicUrl: string | null = null;

        if (file) {
          const presignRes = await fetch("/api/upload/presign", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              filename: file.name,
              contentType: file.type,
              folder: "brand-logos",
            }),
          });

          if (!presignRes.ok) throw new Error("Error en preparar la pujada");
          const { signedUrl, publicUrl: url } = await presignRes.json();

          const uploadRes = await fetch(signedUrl, {
            method: "PUT",
            body: file,
            headers: { "Content-Type": file.type },
          });

          if (!uploadRes.ok) throw new Error("Error en pujar la imatge a R2");
          publicUrl = url;
        }

        await createBrand(name, publicUrl, websiteUrl);

        formRef.current?.reset();
        setFile(null);
        if (preview) URL.revokeObjectURL(preview);
        setPreview(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error en desar la marca");
      }
    });
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="flex flex-col gap-4">
      {error && <p className="text-red-400 text-xs">{error}</p>}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1">
          <label className="text-xs text-neutral-500">Nom (opcional)</label>
          <input
            name="name"
            placeholder="Ej: Nike"
            className="bg-white border border-neutral-200 text-neutral-900 rounded-sm px-3 py-2 text-sm outline-none focus:border-neutral-400 transition-colors placeholder:text-neutral-400"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs text-neutral-500">Web (opcional)</label>
          <input
            name="website_url"
            type="url"
            placeholder="https://empresa.com"
            className="bg-white border border-neutral-200 text-neutral-900 rounded-sm px-3 py-2 text-sm outline-none focus:border-neutral-400 transition-colors placeholder:text-neutral-400"
          />
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-xs text-neutral-500">Logo (opcional)</label>
        <div className="flex items-center gap-4">
          <label className="cursor-pointer bg-neutral-50 border border-neutral-200 hover:border-neutral-400 rounded-sm px-3 py-2 text-sm text-neutral-500 transition-colors">
            {file ? file.name : "Seleccionar fitxer"}
            <input
              type="file"
              accept="image/png,image/jpeg,image/svg+xml,image/webp"
              onChange={handleFileChange}
              className="hidden"
            />
          </label>

          {preview && (
            <div className="w-12 h-12 shrink-0 bg-neutral-100 border border-neutral-200 rounded-sm overflow-hidden flex items-center justify-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={preview} alt="Preview" className="w-full h-full object-contain" />
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isPending}
          className="bg-white text-black rounded-sm px-4 py-2 text-xs font-medium tracking-wide hover:bg-neutral-200 transition-colors disabled:opacity-50"
        >
          {isPending ? "Desant..." : "Afegir marca"}
        </button>
      </div>
    </form>
  );
}
