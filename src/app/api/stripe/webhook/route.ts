import { stripe } from "@/lib/stripe";
import { prisma } from "@/prisma";
import { headers } from "next/headers";
import { invalidateStripeCache } from "@/config/stripe";

export async function POST(req: Request) {
  const body = await req.text();
  const headersList = await headers();
  const signature = headersList.get("Stripe-Signature")!;

  try {
    const event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );

    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object;
        
        // Update user subscription status
        await prisma.user.update({
          where: { id: session.metadata?.userId },
          data: {
            stripeCustomerId: session.customer as string,
            subscriptionPlan: session.metadata?.plan,
            subscriptionStatus: "active",
          },
        });
        break;
      }
      
      case "customer.subscription.updated":
      case "customer.subscription.deleted": {
        const subscription = event.data.object;
        
        await prisma.user.update({
          where: {
            id: (await prisma.user.findFirst({
              where: { stripeCustomerId: subscription.customer as string }
            }))?.id || ''
          },
          data: {
            subscriptionStatus: subscription.status,
          },
        });
        break;
      }

      // Add handlers for price and product updates
      case "product.created":
      case "product.updated":
      case "product.deleted":
      case "price.created":
      case "price.updated":
      case "price.deleted": {
        // Invalidate the cache when products or prices change
        invalidateStripeCache();
        break;
      }
    }

    return Response.json({ received: true });
  } catch (error) {
    console.error("Webhook error:", error);
    return Response.json(
      { error: "Webhook handler failed" },
      { status: 400 }
    );
  }
}