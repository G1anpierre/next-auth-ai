import { stripe } from "@/lib/stripe";
import { auth } from "@/auth";
import { prisma } from "@/prisma";
import Stripe from "stripe";

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return Response.json(
        { error: "Not authenticated" },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        stripeCustomerId: true,
        subscriptionPlan: true,
        subscriptionStatus: true,
      },
    });

    if (!user?.stripeCustomerId) {
      return Response.json({ subscription: null });
    }

    // First, get the subscription with expanded items
    const subscriptions = await stripe.subscriptions.list({
      customer: user.stripeCustomerId,
      status: 'active',
      expand: ['data.items.data.price'],
    });

    const subscription = subscriptions.data[0];

    if (!subscription) {
      return Response.json({ subscription: null });
    }

    // Get the price ID from the subscription
    const priceId = subscription.items.data[0].price.id;

    // Fetch the price with expanded product
    const price = await stripe.prices.retrieve(priceId, {
      expand: ['product'],
    });

    // Get the product data
    const product = price.product as Stripe.Product;

    return Response.json({
      subscription: {
        id: subscription.id,
        status: subscription.status,
        interval: price.recurring?.interval,
        intervalCount: price.recurring?.interval_count,
        productName: product.name,
        currentPeriodEnd: subscription.current_period_end,
        cancelAtPeriodEnd: subscription.cancel_at_period_end,
        amount: price.unit_amount,
        currency: price.currency,
      },
    });
  } catch (error) {
    console.error('Error fetching subscription:', error);
    return Response.json(
      { error: 'Error fetching subscription details' },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth();
    const { action } = await req.json();

    if (!session?.user?.id) {
      return Response.json(
        { error: "Not authenticated" },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { stripeCustomerId: true },
    });

    if (!user?.stripeCustomerId) {
      return Response.json(
        { error: "No active subscription" },
        { status: 400 }
      );
    }

    const subscriptions = await stripe.subscriptions.list({
      customer: user.stripeCustomerId,
      status: 'active',
    });

    const subscription = subscriptions.data[0];

    if (!subscription) {
      return Response.json(
        { error: "No active subscription found" },
        { status: 400 }
      );
    }

    switch (action) {
      case 'cancel':
        await stripe.subscriptions.update(subscription.id, {
          cancel_at_period_end: true,
        });
        break;

      case 'resume':
        await stripe.subscriptions.update(subscription.id, {
          cancel_at_period_end: false,
        });
        break;

      default:
        return Response.json(
          { error: "Invalid action" },
          { status: 400 }
        );
    }

    return Response.json({ success: true });
  } catch (error) {
    console.error('Error managing subscription:', error);
    return Response.json(
      { error: 'Error managing subscription' },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return Response.json(
        { error: "Not authenticated" },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { stripeCustomerId: true },
    });

    if (!user?.stripeCustomerId) {
      return Response.json(
        { error: "No active subscription" },
        { status: 400 }
      );
    }

    const subscriptions = await stripe.subscriptions.list({
      customer: user.stripeCustomerId,
      status: 'active',
    });

    const subscription = subscriptions.data[0];

    if (!subscription) {
      return Response.json(
        { error: "No active subscription found" },
        { status: 400 }
      );
    }

    // Create a portal session for subscription management
    const portalSession = await stripe.billingPortal.sessions.create({
      customer: user.stripeCustomerId,
      return_url: `${req.headers.get('origin')}/dashboard/settings`,
    });

    return Response.json({ url: portalSession.url });
  } catch (error) {
    console.error('Error updating subscription:', error);
    return Response.json(
      { error: 'Error updating subscription' },
      { status: 500 }
    );
  }
} 