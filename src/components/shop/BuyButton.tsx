"use client";

import { useState } from "react";

interface Props {
  priceId: string;
  inStock: boolean;
}

export function BuyButton({ priceId, inStock }: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleBuy() {
    if (!inStock) return;
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ priceId }),
      });

      if (!res.ok) throw new Error("Error al iniciar el pago");

      const { url } = await res.json();
      if (url) window.location.href = url;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error inesperado");
      setLoading(false);
    }
  }

  if (!inStock) {
    return (
      <button
        disabled
        className="w-full py-3 text-xs tracking-[0.15em] uppercase text-neutral-600 border border-white/5 cursor-not-allowed"
      >
        Agotado
      </button>
    );
  }

  return (
    <div className="flex flex-col gap-1.5">
      <button
        onClick={handleBuy}
        disabled={loading}
        className="w-full py-3 text-xs tracking-[0.15em] uppercase bg-white text-black hover:bg-neutral-200 transition-colors disabled:opacity-60 font-medium"
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <span className="w-3 h-3 border border-black/30 border-t-black rounded-full animate-spin" />
            Redirigiendo...
          </span>
        ) : (
          "Comprar"
        )}
      </button>
      {error && <p className="text-red-400 text-[10px] text-center">{error}</p>}
    </div>
  );
}
