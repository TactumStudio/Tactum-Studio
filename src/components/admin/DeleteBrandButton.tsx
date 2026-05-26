"use client";

import { useTransition } from "react";
import { deleteBrand } from "@/app/admin/brands/actions";

export function DeleteBrandButton({ id }: { id: string }) {
  const [isPending, startTransition] = useTransition();

  function handleDelete() {
    if (!confirm("Eliminar aquesta marca?")) return;
    startTransition(() => deleteBrand(id));
  }

  return (
    <button
      onClick={handleDelete}
      disabled={isPending}
      className="text-xs text-neutral-600 hover:text-red-400 transition-colors disabled:opacity-40 shrink-0"
    >
      {isPending ? "..." : "Eliminar"}
    </button>
  );
}
