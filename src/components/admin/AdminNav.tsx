"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/admin", label: "Tauler" },
  { href: "/admin/projects", label: "Projectes" },
  { href: "/admin/photos", label: "Fotos" },
  { href: "/admin/brands", label: "Marques" },
  { href: "/admin/settings", label: "Configuració" },
];

export function AdminNav() {
  const pathname = usePathname();

  return (
    <nav className="flex flex-row md:flex-col gap-1 flex-1">
      {navItems.map((item) => {
        const isActive =
          item.href === "/admin"
            ? pathname === "/admin"
            : pathname.startsWith(item.href);

        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "text-sm rounded px-2 py-2 transition-colors whitespace-nowrap",
              isActive
                ? "bg-neutral-900 text-white"
                : "text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100"
            )}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
