"use client";

import { useRef, useState, useTransition } from "react";
import { createProject } from "@/app/admin/projects/actions";
import { slugify } from "@/lib/utils";

export function CreateProjectForm() {
  const [slug, setSlug] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const formRef = useRef<HTMLFormElement>(null);

  function handleTitleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setSlug(slugify(e.target.value));
  }

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

    startTransition(async () => {
      try {
        let coverImageUrl: string | null = null;

        // Pujar portada a R2 si hi ha arxiu
        if (file) {
          const presignRes = await fetch("/api/upload/presign", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              filename: file.name,
              contentType: file.type,
              folder: "project-covers",
            }),
          });
          if (!presignRes.ok) throw new Error("Error en preparar la pujada");
          const { signedUrl, publicUrl } = await presignRes.json();

          const uploadRes = await fetch(signedUrl, {
            method: "PUT",
            body: file,
            headers: { "Content-Type": file.type },
          });
          if (!uploadRes.ok) throw new Error("Error en pujar la portada a R2");
          coverImageUrl = publicUrl;
        }

        const formData = new FormData(formRef.current!);
        if (coverImageUrl) formData.set("cover_image_url", coverImageUrl);

        await createProject(formData);

        // Reset
        formRef.current?.reset();
        setSlug("");
        setFile(null);
        if (preview) URL.revokeObjectURL(preview);
        setPreview(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error en crear el projecte");
      }
    });
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="flex flex-col gap-4">
      {error && <p className="text-red-400 text-xs px-1">{error}</p>}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1">
          <label className="text-xs text-neutral-500">Títol *</label>
          <input
            name="title"
            required
            onChange={handleTitleChange}
            placeholder="Ex: Campanya Estiu 2024"
            className="bg-white border border-neutral-200 text-neutral-900 rounded-sm px-3 py-2 text-sm outline-none focus:border-neutral-400 transition-colors placeholder:text-neutral-400"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs text-neutral-500">Slug *</label>
          <input
            name="slug"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            required
            placeholder="campanya-estiu-2024"
            className="bg-white border border-neutral-200 text-neutral-900 rounded-sm px-3 py-2 text-sm outline-none focus:border-neutral-400 font-mono transition-colors placeholder:text-neutral-400"
          />
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-xs text-neutral-500">Descripció</label>
        <div className="flex flex-col gap-1.5">
          <div className="flex items-start gap-2">
            <span className="mt-2 text-[10px] font-mono text-neutral-400 w-5 shrink-0">ES</span>
            <textarea
              name="description"
              rows={2}
              placeholder="Descripció en castellà..."
              className="flex-1 bg-white border border-neutral-200 text-neutral-900 rounded-sm px-3 py-2 text-sm outline-none focus:border-neutral-400 transition-colors resize-none placeholder:text-neutral-400"
            />
          </div>
          <div className="flex items-start gap-2">
            <span className="mt-2 text-[10px] font-mono text-neutral-400 w-5 shrink-0">CA</span>
            <textarea
              name="description_ca"
              rows={2}
              placeholder="Descripció en català..."
              className="flex-1 bg-white border border-neutral-200 text-neutral-900 rounded-sm px-3 py-2 text-sm outline-none focus:border-neutral-400 transition-colors resize-none placeholder:text-neutral-400"
            />
          </div>
          <div className="flex items-start gap-2">
            <span className="mt-2 text-[10px] font-mono text-neutral-400 w-5 shrink-0">EN</span>
            <textarea
              name="description_en"
              rows={2}
              placeholder="Description in English..."
              className="flex-1 bg-white border border-neutral-200 text-neutral-900 rounded-sm px-3 py-2 text-sm outline-none focus:border-neutral-400 transition-colors resize-none placeholder:text-neutral-400"
            />
          </div>
        </div>
      </div>

      {/* Imatge de portada */}
      <div className="flex flex-col gap-1">
        <label className="text-xs text-neutral-500">Imatge de portada (opcional)</label>
        <div className="flex items-center gap-4">
          <label className="cursor-pointer bg-neutral-50 border border-neutral-200 hover:border-neutral-400 rounded-sm px-3 py-2 text-sm text-neutral-500 transition-colors">
            {file ? file.name : "Seleccionar imatge"}
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp,image/avif"
              onChange={handleFileChange}
              className="hidden"
            />
          </label>

          {preview && (
            <div className="w-14 h-10 shrink-0 bg-neutral-100 border border-neutral-200 rounded-sm overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={preview} alt="Preview" className="w-full h-full object-cover" />
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between">
        <label className="flex items-center gap-2 cursor-pointer select-none">
          <input
            type="checkbox"
            name="is_featured"
            className="w-3.5 h-3.5 accent-white"
          />
          <span className="text-xs text-neutral-400">
            Marcar com a destacat (apareix a l&apos;Inici)
          </span>
        </label>

        <button
          type="submit"
          disabled={isPending}
          className="bg-white text-black rounded-sm px-4 py-2 text-xs font-medium tracking-wide hover:bg-neutral-200 transition-colors disabled:opacity-50 shrink-0"
        >
          {isPending ? (file ? "Pujant..." : "Creant...") : "Crear projecte"}
        </button>
      </div>
    </form>
  );
}
