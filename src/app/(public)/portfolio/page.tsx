import type { Metadata } from "next";
import type { Project } from "@/types";
import { createAdminClient } from "@/lib/supabase/admin";
import { ProjectsGrid } from "@/components/portfolio/ProjectsGrid";
import { getLocale, t } from "@/lib/i18n";

export const metadata: Metadata = {
  title: "Portfolio",
  description: "Todos los proyectos.",
};

export default async function PortfolioPage() {
  const supabase = createAdminClient();
  const locale = await getLocale();

  const { data: projects } = await supabase
    .from("projects")
    .select("*")
    .order("display_order", { ascending: true });

  return (
    <div className="min-h-screen bg-white pt-32 pb-24 px-6 md:px-10">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-16">
          <p className="text-xs tracking-[0.3em] uppercase text-neutral-600 mb-3">
            {t('portfolio.label', locale)}
          </p>
          <h1 className="text-4xl md:text-5xl font-light tracking-tight text-neutral-900">
            Portfolio
          </h1>
        </div>

        <ProjectsGrid projects={(projects as Project[]) ?? []} />
      </div>
    </div>
  );
}
