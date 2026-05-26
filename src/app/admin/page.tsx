import type { Metadata } from "next";

export const metadata: Metadata = { title: "Tauler" };

export default function AdminDashboard() {
  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight mb-8">Tauler</h1>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: "Projectes", href: "/admin/projects" },
          { label: "Fotos", href: "/admin/photos" },
          { label: "Marques", href: "/admin/brands" },
        ].map((item) => (
          <a
            key={item.href}
            href={item.href}
            className="block p-6 bg-neutral-50 rounded-sm border border-neutral-200 hover:border-neutral-400 transition-colors"
          >
            <p className="text-xs tracking-widest uppercase text-neutral-500 mb-2">
              Gestionar
            </p>
            <p className="text-neutral-900 font-medium">{item.label}</p>
          </a>
        ))}
      </div>
    </div>
  );
}
