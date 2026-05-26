import Image from "next/image";
import { BuyButton } from "./BuyButton";
import type { Product } from "@/types";

function formatPrice(cents: number) {
  return new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: "EUR",
  }).format(cents / 100);
}

const categoryLabel: Record<string, string> = {
  tshirt: "Camiseta",
  print: "Print",
};

export function ProductCard({ product }: { product: Product }) {
  return (
    <div className="group flex flex-col">
      {/* Imagen */}
      <div className="relative aspect-[3/4] overflow-hidden bg-neutral-900 mb-4">
        {product.image_url ? (
          <Image
            src={product.image_url}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-neutral-700 text-xs tracking-widest uppercase">
              Sin imagen
            </span>
          </div>
        )}

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {product.category && categoryLabel[product.category] && (
            <span className="bg-black/70 text-white text-[10px] tracking-widest uppercase px-2 py-1 backdrop-blur-sm">
              {categoryLabel[product.category]}
            </span>
          )}
          {!product.in_stock && (
            <span className="bg-neutral-800/90 text-neutral-400 text-[10px] tracking-widest uppercase px-2 py-1">
              Agotado
            </span>
          )}
        </div>
      </div>

      {/* Info */}
      <div className="flex flex-col gap-3 flex-1">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-white text-sm font-medium leading-tight">
              {product.name}
            </h3>
            {product.description && (
              <p className="text-neutral-500 text-xs mt-1 leading-relaxed line-clamp-2">
                {product.description}
              </p>
            )}
          </div>
          <span className="text-white text-sm font-medium shrink-0 tabular-nums">
            {formatPrice(product.price_cents)}
          </span>
        </div>

        <BuyButton priceId={product.stripe_price_id} inStock={product.in_stock} />
      </div>
    </div>
  );
}
