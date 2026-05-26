import { createAdminClient } from "@/lib/supabase/admin";
import { updateSettings } from "./actions";
import { HeroImageUploader } from "./HeroImageUploader";
import type { SiteSettings } from "@/types";

export default async function SettingsPage(props: {
  searchParams: Promise<{ saved?: string; error?: string }>;
}) {
  const searchParams = await props.searchParams;

  const supabase = createAdminClient();
  const { data } = await supabase
    .from("site_settings")
    .select("*")
    .eq("id", 1)
    .maybeSingle();

  const settings = data as SiteSettings | null;

  const inputClass =
    "w-full bg-white border border-neutral-200 rounded px-3 py-2 text-sm text-neutral-900 placeholder-neutral-400 focus:outline-none focus:border-neutral-400 transition-colors";
  const labelClass =
    "block text-[10px] tracking-[0.3em] uppercase text-neutral-500 mb-1.5";
  const sectionClass = "border border-neutral-200 rounded-lg p-6 space-y-4";

  return (
    <div>
      <h1 className="text-xl font-light text-neutral-900 mb-2">
        Configuració del Lloc
      </h1>
      <p className="text-xs text-neutral-600 mb-6">
        Aquests canvis s&apos;apliquen al lloc públic de forma immediata.
      </p>

      {/* Feedback */}
      {searchParams.saved && (
        <div className="mb-6 px-4 py-3 bg-emerald-500/10 border border-emerald-500/30 rounded-lg text-emerald-400 text-xs">
          ✓ Canvis desats correctament
        </div>
      )}
      {searchParams.error && (
        <div className="mb-6 px-4 py-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-xs space-y-1">
          <p className="font-medium">✗ Error en desar</p>
          <p className="text-red-500/80">
            {decodeURIComponent(searchParams.error)}
          </p>
          <p className="text-neutral-500 mt-2">
            Si l&apos;error menciona que la taula no existeix, executa el SQL de configuració al Tauler de Supabase → SQL Editor.
          </p>
        </div>
      )}

      <form action={updateSettings} className="space-y-6 max-w-2xl">
        {/* ── HERO ─────────────────────────────────────────────── */}
        <div className={sectionClass}>
          <h2 className="text-[10px] tracking-[0.3em] uppercase text-neutral-500 pb-2 border-b border-neutral-200">
            Hero — Pantalla d&apos;inici
          </h2>

          <HeroImageUploader currentUrl={settings?.hero_image_url ?? null} />

          <div className="space-y-3">
            <label className={labelClass}>Títol — opcional (↵ per a salts de línia)</label>
            <div className="grid grid-cols-1 gap-2">
              <div className="flex gap-2 items-start">
                <span className="text-[9px] tracking-widest uppercase text-neutral-400 w-6 pt-2.5 shrink-0">ES</span>
                <textarea
                  name="hero_title"
                  defaultValue={settings?.hero_title ?? ""}
                  rows={2}
                  className={`${inputClass} resize-none flex-1`}
                  placeholder="FOTOGRAFÍA & AUDIOVISUAL"
                />
              </div>
              <div className="flex gap-2 items-start">
                <span className="text-[9px] tracking-widest uppercase text-neutral-400 w-6 pt-2.5 shrink-0">CA</span>
                <textarea
                  name="hero_title_ca"
                  defaultValue={settings?.hero_title_ca ?? ""}
                  rows={2}
                  className={`${inputClass} resize-none flex-1`}
                  placeholder="Si buida, utilitza la versió castellana"
                />
              </div>
              <div className="flex gap-2 items-start">
                <span className="text-[9px] tracking-widest uppercase text-neutral-400 w-6 pt-2.5 shrink-0">EN</span>
                <textarea
                  name="hero_title_en"
                  defaultValue={settings?.hero_title_en ?? ""}
                  rows={2}
                  className={`${inputClass} resize-none flex-1`}
                  placeholder="If empty, falls back to Spanish"
                />
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <label className={labelClass}>Subtítol — opcional</label>
            <div className="grid grid-cols-1 gap-2">
              <div className="flex gap-2 items-center">
                <span className="text-[9px] tracking-widest uppercase text-neutral-400 w-6 shrink-0">ES</span>
                <input name="hero_subtitle" type="text" defaultValue={settings?.hero_subtitle ?? ""} className={`${inputClass} flex-1`} placeholder="Capturando instantes, construyendo narrativas visuales." />
              </div>
              <div className="flex gap-2 items-center">
                <span className="text-[9px] tracking-widest uppercase text-neutral-400 w-6 shrink-0">CA</span>
                <input name="hero_subtitle_ca" type="text" defaultValue={settings?.hero_subtitle_ca ?? ""} className={`${inputClass} flex-1`} placeholder="Si buida, utilitza la versió castellana" />
              </div>
              <div className="flex gap-2 items-center">
                <span className="text-[9px] tracking-widest uppercase text-neutral-400 w-6 shrink-0">EN</span>
                <input name="hero_subtitle_en" type="text" defaultValue={settings?.hero_subtitle_en ?? ""} className={`${inputClass} flex-1`} placeholder="If empty, falls back to Spanish" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Color del text</label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  name="hero_text_color"
                  defaultValue={settings?.hero_text_color ?? "#ffffff"}
                  className="w-10 h-10 cursor-pointer rounded border border-neutral-200 bg-white p-0.5"
                />
                <span className="text-xs text-neutral-500">
                  Tria el color que contrasti amb la teva foto
                </span>
              </div>
            </div>

            <div>
              <label className={labelClass}>Mida del títol</label>
              <select
                name="hero_title_size"
                defaultValue={settings?.hero_title_size ?? "md"}
                className={inputClass}
              >
                <option value="xs">XS — Molt petit</option>
                <option value="sm">S — Petit</option>
                <option value="md">M — Mitjà (recomanat)</option>
                <option value="lg">L — Gran</option>
                <option value="xl">XL — Molt gran</option>
              </select>
            </div>
          </div>
        </div>

        {/* ── INTRO HOMEPAGE ───────────────────────────────────── */}
        <div className={sectionClass}>
          <h2 className="text-[10px] tracking-[0.3em] uppercase text-neutral-500 pb-2 border-b border-neutral-200">
            Text intro — Pàgina d&apos;inici
          </h2>
          <label className={labelClass}>
            Breu descripció (apareix al costat de les marques) — opcional
          </label>
          <div className="grid grid-cols-1 gap-2">
            <div className="flex gap-2 items-start">
              <span className="text-[9px] tracking-widest uppercase text-neutral-400 w-6 pt-2.5 shrink-0">ES</span>
              <textarea name="intro_text" defaultValue={settings?.intro_text ?? ""} rows={4} className={`${inputClass} resize-y flex-1`} placeholder={"Soy fotógrafo especializado en montaña y producción audiovisual.\n\nSepara párrafos con una línea en blanco."} />
            </div>
            <div className="flex gap-2 items-start">
              <span className="text-[9px] tracking-widest uppercase text-neutral-400 w-6 pt-2.5 shrink-0">CA</span>
              <textarea name="intro_text_ca" defaultValue={settings?.intro_text_ca ?? ""} rows={4} className={`${inputClass} resize-y flex-1`} placeholder="Si buida, utilitza la versió castellana" />
            </div>
            <div className="flex gap-2 items-start">
              <span className="text-[9px] tracking-widest uppercase text-neutral-400 w-6 pt-2.5 shrink-0">EN</span>
              <textarea name="intro_text_en" defaultValue={settings?.intro_text_en ?? ""} rows={4} className={`${inputClass} resize-y flex-1`} placeholder="If empty, falls back to Spanish" />
            </div>
          </div>
        </div>

        {/* ── ABOUT ────────────────────────────────────────────── */}
        <div className={sectionClass}>
          <h2 className="text-[10px] tracking-[0.3em] uppercase text-neutral-500 pb-2 border-b border-neutral-200">
            Sobre mi
          </h2>
          <label className={labelClass}>
            Text de la pàgina Sobre mi (separa paràgrafs amb línia en blanc)
          </label>
          <div className="grid grid-cols-1 gap-2">
            <div className="flex gap-2 items-start">
              <span className="text-[9px] tracking-widest uppercase text-neutral-400 w-6 pt-2.5 shrink-0">ES</span>
              <textarea name="about_content" defaultValue={settings?.about_content ?? ""} rows={8} className={`${inputClass} resize-y flex-1`} placeholder="Escriu aquí la teva biografia o presentació..." />
            </div>
            <div className="flex gap-2 items-start">
              <span className="text-[9px] tracking-widest uppercase text-neutral-400 w-6 pt-2.5 shrink-0">CA</span>
              <textarea name="about_content_ca" defaultValue={settings?.about_content_ca ?? ""} rows={8} className={`${inputClass} resize-y flex-1`} placeholder="Si buida, utilitza la versió castellana" />
            </div>
            <div className="flex gap-2 items-start">
              <span className="text-[9px] tracking-widest uppercase text-neutral-400 w-6 pt-2.5 shrink-0">EN</span>
              <textarea name="about_content_en" defaultValue={settings?.about_content_en ?? ""} rows={8} className={`${inputClass} resize-y flex-1`} placeholder="If empty, falls back to Spanish" />
            </div>
          </div>
        </div>

        {/* ── CONTACTE ─────────────────────────────────────────── */}
        <div className={sectionClass}>
          <h2 className="text-[10px] tracking-[0.3em] uppercase text-neutral-500 pb-2 border-b border-neutral-200">
            Contacte
          </h2>
          <div>
            <label className={labelClass}>Correu electrònic</label>
            <input
              name="contact_email"
              type="email"
              defaultValue={settings?.contact_email ?? ""}
              className={inputClass}
              placeholder="tu@email.com"
            />
          </div>
          <div>
            <label className={labelClass}>URL d&apos;Instagram</label>
            <input
              name="contact_instagram"
              type="url"
              defaultValue={settings?.contact_instagram ?? ""}
              className={inputClass}
              placeholder="https://instagram.com/tu_usuario"
            />
            <p className="text-[10px] text-neutral-500 mt-1">
              URL completa — ex: https://instagram.com/inaki.foto
            </p>
          </div>
          <div>
            <label className={labelClass}>Telèfon — opcional</label>
            <input
              name="contact_phone"
              type="text"
              defaultValue={settings?.contact_phone ?? ""}
              className={inputClass}
              placeholder="+34 600 000 000"
            />
          </div>
          <div>
            <label className={labelClass}>Ubicació — opcional (apareix amb mapa)</label>
            <input
              name="contact_location"
              type="text"
              defaultValue={settings?.contact_location ?? ""}
              className={inputClass}
              placeholder="Ej: Bilbao, España"
            />
            <p className="text-[10px] text-neutral-500 mt-1">
              Ciutat o adreça — s&apos;usarà per mostrar el mapa a la pàgina de contacte
            </p>
          </div>
        </div>

        <button
          type="submit"
          className="px-6 py-3 bg-white text-neutral-950 text-xs tracking-[0.2em] uppercase font-medium hover:bg-neutral-100 transition-colors rounded"
        >
          Desar canvis
        </button>
      </form>
    </div>
  );
}
