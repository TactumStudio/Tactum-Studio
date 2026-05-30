import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { createAdminClient } from "@/lib/supabase/admin";

const resend = new Resend(process.env.RESEND_API_KEY);

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const { name, email, message } = body ?? {};

  if (
    typeof name !== "string" || !name.trim() ||
    typeof email !== "string" || !email.includes("@") ||
    typeof message !== "string" || !message.trim()
  ) {
    return NextResponse.json({ error: "missing_fields" }, { status: 400 });
  }

  const supabase = createAdminClient();
  const { data } = await supabase
    .from("site_settings")
    .select("contact_email")
    .eq("id", 1)
    .maybeSingle();

  const toEmail = data?.contact_email;
  if (!toEmail) {
    return NextResponse.json({ error: "no_recipient" }, { status: 500 });
  }

  const safeName = escapeHtml(name.trim());
  const safeEmail = escapeHtml(email.trim());
  const safeMessage = escapeHtml(message.trim()).replace(/\n/g, "<br/>");

  const { error } = await resend.emails.send({
    from: process.env.RESEND_FROM_EMAIL ?? "Portfolio <onboarding@resend.dev>",
    to: toEmail,
    replyTo: email.trim(),
    subject: `Nou missatge de contacte — ${name.trim()}`,
    html: `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto;color:#333">
        <h2 style="font-weight:400;border-bottom:1px solid #eee;padding-bottom:12px">
          Nou missatge de contacte
        </h2>
        <p><strong>Nom:</strong> ${safeName}</p>
        <p><strong>Email:</strong> <a href="mailto:${safeEmail}">${safeEmail}</a></p>
        <p style="margin-top:24px"><strong>Missatge:</strong></p>
        <p style="background:#f9f9f9;padding:16px;border-left:3px solid #ccc">
          ${safeMessage}
        </p>
        <p style="margin-top:32px;font-size:12px;color:#999">
          Enviat des del formulari de contacte del portfolio
        </p>
      </div>
    `,
    text: `Nom: ${name.trim()}\nEmail: ${email.trim()}\n\n${message.trim()}`,
  });

  if (error) {
    console.error("[contact] resend error:", error);
    return NextResponse.json({ error: "send_failed" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
