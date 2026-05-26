"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import type { Brand } from "@/types";

interface Props {
  brands: Brand[];
}

export function BrandsCarousel({ brands }: Props) {
  if (!brands || brands.length === 0) return null;

  const doubled = [...brands, ...brands];
  const duration = Math.max(brands.length * 4, 20);

  return (
    <div className="relative overflow-hidden">
      <div className="absolute left-0 top-0 bottom-0 w-24 z-10 bg-gradient-to-r from-white to-transparent pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-24 z-10 bg-gradient-to-l from-white to-transparent pointer-events-none" />

      <motion.div
        className="flex items-center gap-16 w-max"
        animate={{ x: ["0%", "-50%"] }}
        transition={{
          duration,
          ease: "linear",
          repeat: Infinity,
        }}
      >
        {doubled.map((brand, i) => (
          <div
            key={`${brand.id}-${i}`}
            className="flex items-center gap-3 shrink-0"
          >
            {brand.website_url ? (
              <a
                href={brand.website_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 opacity-70 hover:opacity-100 transition-opacity duration-300"
              >
                <BrandItem brand={brand} />
              </a>
            ) : (
              <div className="flex items-center gap-3 opacity-70">
                <BrandItem brand={brand} />
              </div>
            )}
          </div>
        ))}
      </motion.div>
    </div>
  );
}

function BrandItem({ brand }: { brand: Brand }) {
  return (
    <>
      {brand.logo_url && (
        <div className="relative w-8 h-8 shrink-0">
          <Image
            src={brand.logo_url}
            alt={brand.name ?? ""}
            fill
            className="object-contain"
            sizes="32px"
          />
        </div>
      )}
      {brand.name && (
        <span className="text-xs tracking-[0.15em] uppercase text-neutral-950 whitespace-nowrap">
          {brand.name}
        </span>
      )}
    </>
  );
}
