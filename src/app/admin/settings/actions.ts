"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function updateSettings(formData: FormData) {
  const supabase = createAdminClient();

  const payload = {
    id: 1,
    hero_image_url: (formData.get("hero_image_url") as string) || null,
    hero_title: (formData.get("hero_title") as string) || null,
    hero_title_ca: (formData.get("hero_title_ca") as string) || null,
    hero_title_en: (formData.get("hero_title_en") as string) || null,
    hero_subtitle: (formData.get("hero_subtitle") as string) || null,
    hero_subtitle_ca: (formData.get("hero_subtitle_ca") as string) || null,
    hero_subtitle_en: (formData.get("hero_subtitle_en") as string) || null,
    hero_text_color: (formData.get("hero_text_color") as string) || "#ffffff",
    hero_title_size: (formData.get("hero_title_size") as string) || "md",
    intro_text: (formData.get("intro_text") as string) || null,
    intro_text_ca: (formData.get("intro_text_ca") as string) || null,
    intro_text_en: (formData.get("intro_text_en") as string) || null,
    about_content: (formData.get("about_content") as string) || null,
    about_content_ca: (formData.get("about_content_ca") as string) || null,
    about_content_en: (formData.get("about_content_en") as string) || null,
    about_photo_url: (formData.get("about_photo_url") as string) || null,
    about_photo2_url: (formData.get("about_photo2_url") as string) || null,
    contact_email: (formData.get("contact_email") as string) || null,
    contact_instagram: (formData.get("contact_instagram") as string) || null,
    contact_phone: (formData.get("contact_phone") as string) || null,
    contact_location: (formData.get("contact_location") as string) || null,
  };

  const { error } = await supabase
    .from("site_settings")
    .upsert(payload, { onConflict: "id" });

  if (error) {
    redirect(
      "/admin/settings?error=" + encodeURIComponent(error.message)
    );
  }

  revalidatePath("/");
  revalidatePath("/about");
  revalidatePath("/contact");
  redirect("/admin/settings?saved=1");
}
