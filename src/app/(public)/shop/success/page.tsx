import Link from "next/link";
import type { Metadata } from "next";
import { getLocale, t } from "@/lib/i18n";

export const metadata: Metadata = {
  title: "Pedido confirmado",
};

export default async function ShopSuccessPage() {
  const locale = await getLocale();

  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="text-center">
        <p className="text-xs tracking-widest uppercase text-neutral-500 mb-4">
          {t('order.confirmed', locale)}
        </p>
        <h1 className="text-neutral-900 text-3xl font-semibold mb-6">
          {t('order.thanks', locale)}
        </h1>
        <p className="text-neutral-500 text-sm mb-10">
          {t('order.emailSoon', locale)}
        </p>
        <Link
          href="/shop"
          className="text-xs tracking-widest uppercase text-neutral-900 border border-neutral-300 px-6 py-3 hover:bg-neutral-900 hover:text-white transition-colors"
        >
          {t('order.backToShop', locale)}
        </Link>
      </div>
    </div>
  );
}
