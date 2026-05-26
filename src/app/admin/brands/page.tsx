import Image from "next/image";
import type { Metadata } from "next";
import type { Brand } from "@/types";
import { createAdminClient } from "@/lib/supabase/admin";
import { CreateBrandForm } from "@/components/admin/CreateBrandForm";
import { DeleteBrandButton } from "@/components/admin/DeleteBrandButton";

export const metadata: Metadata = { title: "Marques" };

export default async function AdminBrandsPage() {
  const supabase = createAdminClient();

  const { data: brands } = await supabase
    .from("brands")
    .select("*")
    .order("display_order", { ascending: true });

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-semibold tracking-tight mb-8">Marques</h1>

      {/* Formulari */}
      <div className="mb-10 p-6 bg-neutral-50 rounded-sm border border-neutral-200">
        <h2 className="text-xs tracking-widest uppercase text-neutral-500 mb-5">
          Afegir marca
        </h2>
        <CreateBrandForm />
      </div>

      {/* Llista */}
      <h2 className="text-xs tracking-widest uppercase text-neutral-500 mb-4">
        Marques actuals
      </h2>

      {!brands || brands.length === 0 ? (
        <div className="flex items-center justify-center h-32 border border-dashed border-neutral-200 rounded-sm">
          <p className="text-neutral-400 text-xs tracking-widest uppercase">
            Encara no hi ha marques
          </p>
        </div>
      ) : (
        <div className="flex flex-col divide-y divide-neutral-100 border border-neutral-200 rounded-sm overflow-hidden">
          {(brands as Brand[]).map((brand) => (
            <div
              key={brand.id}
              className="flex items-center gap-4 px-4 py-3 hover:bg-neutral-50 transition-colors"
            >
              <div className="w-10 h-10 shrink-0 bg-neutral-100 rounded-sm overflow-hidden flex items-center justify-center">
                {brand.logo_url ? (
                  <Image
                    src={brand.logo_url}
                    alt={brand.name ?? ""}
                    width={40}
                    height={40}
                    className="object-contain"
                  />
                ) : (
                  <span className="text-neutral-700 text-[10px]">—</span>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-sm text-neutral-900 font-medium">{brand.name ?? "—"}</p>
                {brand.website_url && (
                  <p className="text-xs text-neutral-500 truncate">
                    {brand.website_url}
                  </p>
                )}
              </div>

              <DeleteBrandButton id={brand.id} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
