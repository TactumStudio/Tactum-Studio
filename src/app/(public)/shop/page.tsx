import type { Metadata } from "next";
import type { Product } from "@/types";
import { createAdminClient } from "@/lib/supabase/admin";
import { ProductCard } from "@/components/shop/ProductCard";
import { getLocale, t } from "@/lib/i18n";

export const metadata: Metadata = {
  description: "Camisetas y prints exclusivos.",
};

export default async function ShopPage() {
  const supabase = createAdminClient();
  const locale = await getLocale();

  const { data: products } = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: true });

  const tshirts = (products as Product[] | null)?.filter(
    (p) => p.category === "tshirt"
  );
  const prints = (products as Product[] | null)?.filter(
    (p) => p.category === "print"
  );

  const hasProducts = products && products.length > 0;

  return (
    <div className="min-h-screen bg-white pt-32 pb-24 px-6 md:px-10">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-16">
          <p className="text-xs tracking-[0.3em] uppercase text-neutral-600 mb-3">
            {t('shop.label', locale)}
          </p>
          <h1 className="text-4xl md:text-5xl font-light tracking-tight text-neutral-900">
            {t('shop.heading', locale)}
          </h1>
        </div>

        {!hasProducts ? (
          <div className="flex items-center justify-center h-64 border border-dashed border-neutral-200">
            <p className="text-neutral-600 text-xs tracking-widest uppercase">
              {t('shop.soon', locale)}
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-20">
            {/* Camisetas */}
            {tshirts && tshirts.length > 0 && (
              <section>
                <div className="flex items-center gap-6 mb-8">
                  <h2 className="text-xs tracking-[0.3em] uppercase text-neutral-500">
                    {t('shop.tshirts', locale)}
                  </h2>
                  <div className="flex-1 h-px bg-neutral-200" />
                  <span className="text-xs text-neutral-700 tabular-nums">
                    {tshirts.length}
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                  {tshirts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              </section>
            )}

            {/* Prints */}
            {prints && prints.length > 0 && (
              <section>
                <div className="flex items-center gap-6 mb-8">
                  <h2 className="text-xs tracking-[0.3em] uppercase text-neutral-500">
                    {t('shop.prints', locale)}
                  </h2>
                  <div className="flex-1 h-px bg-neutral-200" />
                  <span className="text-xs text-neutral-700 tabular-nums">
                    {prints.length}
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                  {prints.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              </section>
            )}

            {/* Productos sin categoría */}
            {products.filter(
              (p) => p.category !== "tshirt" && p.category !== "print"
            ).length > 0 && (
              <section>
                <div className="flex items-center gap-6 mb-8">
                  <h2 className="text-xs tracking-[0.3em] uppercase text-neutral-500">
                    {t('shop.other', locale)}
                  </h2>
                  <div className="flex-1 h-px bg-neutral-200" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                  {(products as Product[])
                    .filter(
                      (p) => p.category !== "tshirt" && p.category !== "print"
                    )
                    .map((product) => (
                      <ProductCard key={product.id} product={product} />
                    ))}
                </div>
              </section>
            )}
          </div>
        )}

        {/* Info de envío */}
        {hasProducts && (
          <div className="mt-20 pt-10 border-t border-neutral-100 grid grid-cols-1 sm:grid-cols-3 gap-8">
            {[
              { labelKey: 'shop.payment', descKey: 'shop.paymentDesc' },
              { labelKey: 'shop.shipping', descKey: 'shop.shippingDesc' },
              { labelKey: 'shop.quality', descKey: 'shop.qualityDesc' },
            ].map(({ labelKey, descKey }) => (
              <div key={labelKey} className="text-center">
                <p className="text-xs tracking-[0.2em] uppercase text-neutral-500 mb-1">
                  {t(labelKey, locale)}
                </p>
                <p className="text-xs text-neutral-700">{t(descKey, locale)}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
