import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import Stripe from "stripe";
import { stripe } from "@/lib/stripe";

export async function POST(request: NextRequest) {
  const body = await request.text();
  const headersList = await headers();
  const signature = headersList.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "Sin firma" }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch {
    return NextResponse.json({ error: "Firma inválida" }, { status: 400 });
  }

  switch (event.type) {
    case "checkout.session.completed": {
      // const session = event.data.object as Stripe.Checkout.Session;
      // Aquí: guardar el pedido en Supabase si es necesario
      break;
    }
    default:
      break;
  }

  return NextResponse.json({ received: true });
}
