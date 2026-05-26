import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";

export async function POST(request: NextRequest) {
  const { priceId } = await request.json();

  if (!priceId) {
    return NextResponse.json({ error: "priceId requerido" }, { status: 400 });
  }

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: [{ price: priceId, quantity: 1 }],
    mode: "payment",
    success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/shop/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/shop/cancel`,
  });

  return NextResponse.json({ url: session.url });
}
