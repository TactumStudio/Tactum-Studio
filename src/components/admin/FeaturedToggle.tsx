"use client";

import { useOptimistic, useTransition } from "react";
import { toggleFeatured } from "@/app/admin/projects/actions";
import { cn } from "@/lib/utils";

interface Props {
  id: string;
  isFeatured: boolean;
}

export function FeaturedToggle({ id, isFeatured }: Props) {
  const [optimistic, setOptimistic] = useOptimistic(isFeatured);
  const [, startTransition] = useTransition();

  function handleClick() {
    startTransition(async () => {
      setOptimistic(!optimistic);
      await toggleFeatured(id, !optimistic);
    });
  }

  return (
    <button
      onClick={handleClick}
      aria-label={optimistic ? "Treure dels destacats" : "Marcar com a destacat"}
      className={cn(
        "relative inline-flex h-5 w-9 shrink-0 rounded-full transition-colors duration-200 focus:outline-none",
        optimistic ? "bg-neutral-900" : "bg-neutral-200"
      )}
    >
      <span
        className={cn(
          "pointer-events-none inline-block h-4 w-4 mt-0.5 rounded-full bg-white shadow transition-transform duration-200",
          optimistic ? "translate-x-4 ml-0.5" : "translate-x-0.5"
        )}
      />
    </button>
  );
}
