import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Admin Login" };

async function login(formData: FormData) {
  "use server";
  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  });
  if (error) redirect("/admin/login?error=1");
  redirect("/admin");
}

interface Props {
  searchParams: Promise<{ error?: string }>;
}

export default async function LoginPage({ searchParams }: Props) {
  const { error } = await searchParams;

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-950">
      <div className="w-full max-w-sm">
        <p className="text-xs tracking-widest uppercase text-neutral-500 text-center mb-8">
          Admin
        </p>

        {error && (
          <p className="text-red-400 text-xs text-center mb-4 tracking-wide">
            Correu o contrasenya incorrectes.
          </p>
        )}

        <form action={login} className="flex flex-col gap-3">
          <input
            type="email"
            name="email"
            placeholder="Email"
            required
            autoComplete="email"
            className="bg-neutral-900 border border-white/10 text-white rounded-sm px-4 py-3 text-sm outline-none focus:border-white/30 transition-colors placeholder:text-neutral-600"
          />
          <input
            type="password"
            name="password"
            placeholder="Contrasenya"
            required
            autoComplete="current-password"
            className="bg-neutral-900 border border-white/10 text-white rounded-sm px-4 py-3 text-sm outline-none focus:border-white/30 transition-colors placeholder:text-neutral-600"
          />
          <button
            type="submit"
            className="mt-2 bg-white text-black rounded-sm py-3 text-sm font-medium tracking-wide hover:bg-neutral-200 transition-colors"
          >
            Entrar
          </button>
        </form>
      </div>
    </div>
  );
}
