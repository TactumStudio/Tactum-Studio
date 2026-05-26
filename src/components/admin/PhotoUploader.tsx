"use client";

import { useCallback, useState, useTransition } from "react";
import { useDropzone } from "react-dropzone";
import Image from "next/image";
import { savePhoto } from "@/app/admin/photos/actions";

interface UploadItem {
  id: string;
  file: File;
  previewUrl: string;
  status: "pending" | "uploading" | "done" | "error";
  errorMsg?: string;
  publicUrl?: string;
}

interface Props {
  projectId: string;
}

export function PhotoUploader({ projectId }: Props) {
  const [items, setItems] = useState<UploadItem[]>([]);
  const [isUploading, startUpload] = useTransition();

  const onDrop = useCallback((accepted: File[]) => {
    const newItems: UploadItem[] = accepted.map((file) => ({
      id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
      file,
      previewUrl: URL.createObjectURL(file),
      status: "pending",
    }));
    setItems((prev) => [...prev, ...newItems]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [".jpg", ".jpeg", ".png", ".webp", ".avif"] },
    multiple: true,
    disabled: isUploading,
  });

  function removeItem(id: string) {
    setItems((prev) => {
      const item = prev.find((i) => i.id === id);
      if (item) URL.revokeObjectURL(item.previewUrl);
      return prev.filter((i) => i.id !== id);
    });
  }

  async function uploadOne(item: UploadItem): Promise<void> {
    setItems((prev) =>
      prev.map((i) => (i.id === item.id ? { ...i, status: "uploading" } : i))
    );

    try {
      const presignRes = await fetch("/api/upload/presign", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          filename: item.file.name,
          contentType: item.file.type,
          folder: "project-photos",
        }),
      });

      if (!presignRes.ok) throw new Error("Error en preparar la pujada");
      const { signedUrl, publicUrl } = await presignRes.json();

      const uploadRes = await fetch(signedUrl, {
        method: "PUT",
        body: item.file,
        headers: { "Content-Type": item.file.type },
      });

      if (!uploadRes.ok) throw new Error("Error en pujar a R2");

      await savePhoto(projectId, publicUrl);

      setItems((prev) =>
        prev.map((i) =>
          i.id === item.id ? { ...i, status: "done", publicUrl } : i
        )
      );
    } catch (err) {
      setItems((prev) =>
        prev.map((i) =>
          i.id === item.id
            ? {
                ...i,
                status: "error",
                errorMsg: err instanceof Error ? err.message : "Error",
              }
            : i
        )
      );
    }
  }

  function handleUploadAll() {
    const pending = items.filter((i) => i.status === "pending");
    if (!pending.length) return;

    startUpload(async () => {
      await Promise.all(pending.map(uploadOne));
    });
  }

  const pendingCount = items.filter((i) => i.status === "pending").length;
  const doneCount = items.filter((i) => i.status === "done").length;

  return (
    <div className="flex flex-col gap-6">
      {/* Drop zone */}
      <div
        {...getRootProps()}
        className={`flex flex-col items-center justify-center gap-3 h-40 border-2 border-dashed rounded-sm cursor-pointer transition-colors
          ${isDragActive ? "border-neutral-500 bg-neutral-50" : "border-neutral-200 hover:border-neutral-400"}`}
      >
        <input {...getInputProps()} />
        <svg
          className="w-8 h-8 text-neutral-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1}
            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
          />
        </svg>
        <p className="text-xs text-neutral-500">
          {isDragActive
            ? "Deixa les fotos aquí"
            : "Arrossega fotos o fes clic per seleccionar"}
        </p>
        <p className="text-xs text-neutral-700">JPG, PNG, WebP, AVIF</p>
      </div>

      {/* Grid preview */}
      {items.length > 0 && (
        <>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
            {items.map((item) => (
              <div key={item.id} className="relative group aspect-square">
                <Image
                  src={item.previewUrl}
                  alt=""
                  fill
                  className="object-cover rounded-sm"
                  unoptimized
                />

                {/* Status overlay */}
                {item.status === "uploading" && (
                  <div className="absolute inset-0 bg-black/60 rounded-sm flex items-center justify-center">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  </div>
                )}
                {item.status === "done" && (
                  <div className="absolute inset-0 bg-black/40 rounded-sm flex items-center justify-center">
                    <svg
                      className="w-5 h-5 text-green-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                )}
                {item.status === "error" && (
                  <div className="absolute inset-0 bg-red-900/60 rounded-sm flex items-center justify-center p-1">
                    <p className="text-red-300 text-[9px] text-center leading-tight">
                      {item.errorMsg}
                    </p>
                  </div>
                )}

                {/* Remove button (only on pending) */}
                {item.status === "pending" && (
                  <button
                    onClick={() => removeItem(item.id)}
                    className="absolute top-1 right-1 w-5 h-5 bg-black/70 rounded-full text-white text-xs hidden group-hover:flex items-center justify-center hover:bg-red-600 transition-colors"
                    aria-label="Eliminar"
                  >
                    ×
                  </button>
                )}
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between">
            <p className="text-xs text-neutral-500">
              {pendingCount > 0 && `${pendingCount} pendents · `}
              {doneCount > 0 && `${doneCount} pujades`}
            </p>
            <div className="flex gap-3">
              {pendingCount > 0 && (
                <button
                  onClick={handleUploadAll}
                  disabled={isUploading}
                  className="bg-white text-black rounded-sm px-4 py-2 text-xs font-medium tracking-wide hover:bg-neutral-200 transition-colors disabled:opacity-50"
                >
                  {isUploading
                    ? "Pujant..."
                    : `Pujar ${pendingCount} foto${pendingCount !== 1 ? "es" : ""}`}
                </button>
              )}
              {doneCount > 0 && pendingCount === 0 && (
                <button
                  onClick={() =>
                    setItems((prev) => prev.filter((i) => i.status !== "done"))
                  }
                  className="text-xs text-neutral-600 hover:text-neutral-400 transition-colors"
                >
                  Netejar completades
                </button>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
