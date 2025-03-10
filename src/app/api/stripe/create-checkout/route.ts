import { stripe } from "@/lib/stripe";
import { auth } from "@/auth";
import { headers } from "next/headers";
import { getStripePrices } from "@/config/stripe";

export async function POST(req: Request) {
  try {
    const session = await auth();
    const { plan, frequency } = await req.json();
    
    if (!session?.user?.id) {
      return Response.json(
        { error: "Not authenticated" },
        { status: 401 }
      );
    }

    const headersList = await headers();
    const origin = headersList.get("origin");

    // Get dynamic prices from Stripe
    const prices = await getStripePrices();
    
    // Find the product by name (case insensitive)
    const selectedProduct = Object.values(prices).find(
      product => product.name.toLowerCase() === plan.toLowerCase()
    );

    if (!selectedProduct) {
      return Response.json(
        { error: "Selected plan not found" },
        { status: 400 }
      );
    }

    const priceId = selectedProduct.prices[frequency as 'yearly' | 'quarterly'];

    if (!priceId) {
      return Response.json(
        { error: `${frequency} pricing not available for ${plan} plan` },
        { status: 400 }
      );
    }

    const checkoutSession = await stripe.checkout.sessions.create({
      mode: "subscription",
      customer_email: session.user.email!,
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `${origin}/dashboard?success=true`,
      cancel_url: `${origin}/pricing?canceled=true`,
      metadata: {
        userId: session.user.id,
        plan,
        frequency,
      },
    });

    return Response.json({ url: checkoutSession.url });
  } catch (error) {
    console.error("Error creating checkout session:", error);
    return Response.json(
      { error: "Error creating checkout session" },
      { status: 500 }
    );
  }
}