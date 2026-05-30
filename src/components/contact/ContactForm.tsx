"use client";

import { useState } from "react";
import { t, type Locale } from "@/lib/i18n/translations";

interface Props {
  locale: Locale;
}

export function ContactForm({ locale }: Props) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");

  async function handleSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");

    const res = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, message }),
    });

    if (res.ok) {
      setStatus("success");
      setName("");
      setEmail("");
      setMessage("");
    } else {
      setStatus("error");
    }
  }

  const inputClass =
    "w-full bg-white border border-neutral-300 rounded-sm px-4 py-3 text-sm text-neutral-900 placeholder:text-neutral-400 outline-none focus:border-neutral-700 transition-colors";

  const labelClass = "text-[9px] tracking-[0.4em] uppercase text-neutral-600 mb-1.5";

  if (status === "success") {
    return (
      <div className="py-10">
        <p className="text-[9px] tracking-[0.4em] uppercase text-neutral-500 mb-3">
          {t("contact.form.sent", locale)}
        </p>
        <p className="text-2xl font-light text-neutral-900">
          {t("contact.form.sentMsg", locale)}
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="flex flex-col">
          <label className={labelClass}>{t("contact.form.name", locale)} *</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            placeholder={t("contact.form.namePlaceholder", locale)}
            className={inputClass}
          />
        </div>
        <div className="flex flex-col">
          <label className={labelClass}>{t("contact.form.email", locale)} *</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="hola@exemple.com"
            className={inputClass}
          />
        </div>
      </div>

      <div className="flex flex-col">
        <label className={labelClass}>{t("contact.form.message", locale)} *</label>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          required
          rows={5}
          placeholder={t("contact.form.messagePlaceholder", locale)}
          className={`${inputClass} resize-none`}
        />
      </div>

      {status === "error" && (
        <p className="text-red-500 text-xs -mt-2">
          {t("contact.form.error", locale)}
        </p>
      )}

      <div>
        <button
          type="submit"
          disabled={status === "sending"}
          className="border border-neutral-900 rounded-sm px-8 py-3 text-[9px] tracking-[0.4em] uppercase text-neutral-900 hover:bg-neutral-900 hover:text-white transition-colors disabled:opacity-50"
        >
          {status === "sending"
            ? t("contact.form.sending", locale)
            : t("contact.form.send", locale)}
        </button>
      </div>
    </form>
  );
}
