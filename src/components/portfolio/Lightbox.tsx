"use client";

import { useEffect, useCallback } from "react";
import Image from "next/image";
import type { Photo } from "@/types";

interface Props {
  photos: Photo[];
  index: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}

export function Lightbox({ photos, index, onClose, onPrev, onNext }: Props) {
  const photo = photos[index];

  const handleKey = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") onPrev();
      if (e.key === "ArrowRight") onNext();
    },
    [onClose, onPrev, onNext]
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [handleKey]);

  if (!photo) return null;

  return (
    <div
      className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center"
      onClick={onClose}
    >
      {/* Imagen */}
      <div
        className="relative w-full h-full flex items-center justify-center p-4 md:p-16"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative max-w-5xl w-full max-h-full">
          <Image
            src={photo.url}
            alt={photo.alt_text ?? ""}
            width={1400}
            height={1000}
            className="object-contain max-h-[85vh] w-full"
            sizes="100vw"
            priority
          />
        </div>
      </div>

      {/* Cerrar */}
      <button
        onClick={onClose}
        className="absolute top-5 right-5 w-10 h-10 flex items-center justify-center text-white/60 hover:text-white transition-colors"
        aria-label="Cerrar"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>

      {/* Anterior */}
      {index > 0 && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onPrev();
          }}
          className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center text-white/50 hover:text-white transition-colors"
          aria-label="Anterior"
        >
          <svg
            className="w-7 h-7"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>
      )}

      {/* Siguiente */}
      {index < photos.length - 1 && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onNext();
          }}
          className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center text-white/50 hover:text-white transition-colors"
          aria-label="Siguiente"
        >
          <svg
            className="w-7 h-7"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
      )}

      {/* Contador */}
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 text-xs text-white/40 tracking-widest tabular-nums">
        {index + 1} / {photos.length}
      </div>
    </div>
  );
}
