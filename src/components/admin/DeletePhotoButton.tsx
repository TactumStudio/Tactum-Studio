"use client";

import { useTransition } from "react";
import { deletePhoto } from "@/app/admin/photos/actions";

interface Props {
  id: string;
  projectSlug: string;
}

export function DeletePhotoButton({ id, projectSlug }: Props) {
  const [isPending, startTransition] = useTransition();

  function handleDelete() {
    if (!confirm("Eliminar aquesta foto?")) return;
    startTransition(() => deletePhoto(id, projectSlug));
  }

  return (
    <button
      onClick={handleDelete}
      disabled={isPending}
      className="absolute top-1 left-1 w-5 h-5 bg-black/70 rounded-full text-white text-xs hidden group-hover:flex items-center justify-center hover:bg-red-600 transition-colors disabled:opacity-40"
      aria-label="Eliminar foto"
    >
      {isPending ? (
        <div className="w-2 h-2 border border-white/50 border-t-white rounded-full animate-spin" />
      ) : (
        "×"
      )}
    </button>
  );
}
