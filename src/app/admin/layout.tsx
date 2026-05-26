import { headers } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { AdminNav } from "@/components/admin/AdminNav";
import { redirect } from "next/navigation";

async function logout() {
  "use server";
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const headersList = await headers();
  const pathname = headersList.get("x-pathname") ?? "";

  // La página de login no usa este layout — solo renderiza sus children
  if (pathname.endsWith("/admin/login")) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-white text-neutral-900">
      {/* Sidebar (desktop) / Top bar (mobile) */}
      <aside className="shrink-0 border-b md:border-b-0 md:border-r border-neutral-200 bg-neutral-50 flex flex-row md:flex-col items-center md:items-stretch md:w-56 py-3 md:py-8 px-4 overflow-x-auto gap-3 md:gap-0">
        <p className="text-xs tracking-widest uppercase text-neutral-400 px-2 md:mb-6 whitespace-nowrap shrink-0">
          Admin
        </p>
        <AdminNav />
        <form action={logout} className="shrink-0">
          <button
            type="submit"
            className="text-left text-xs text-neutral-400 hover:text-neutral-600 px-2 py-2 transition-colors whitespace-nowrap"
          >
            Tancar sessió
          </button>
        </form>
      </aside>

      {/* Content */}
      <div className="flex-1 p-4 md:p-8 overflow-auto">{children}</div>
    </div>
  );
}
