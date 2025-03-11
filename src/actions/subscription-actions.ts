"use server";

import { auth } from "@/auth";
import { prisma } from "@/prisma";
import { stripe } from "@/lib/stripe";

export async function getSubscriptionAction() {
  try {
    const session = await auth();

    if (!session) {
      console.log("No session found");
      return { subscription: null };
    }

    if (!session.user?.id) {
      console.log("No user ID in session");
      return { subscription: null };
    }

    console.log("User ID:", session.user.id); // Debug user ID

    const user = await prisma.user.findUnique({
      where: {
        id: session.user.id,
      },
      select: {
        stripeCustomerId: true,
        subscriptionPlan: true,
        subscriptionStatus: true,
      },
    });

    console.log("Prisma User Result:", user); // Debug prisma result

    if (!user) {
      console.log("No user found in database");
      return { subscription: null };
    }

    if (!user.stripeCustomerId) {
      console.log("No Stripe customer ID found");
      return { subscription: null };
    }

    // First, get the subscription with expanded items
    const subscriptions = await stripe.subscriptions.list({
      customer: user.stripeCustomerId,
      status: 'active',
      expand: ['data.items.data.price'],
    });

    const subscription = subscriptions.data[0];

    if (!subscription) {
      console.log("No active subscription found");
      return { subscription: null };
    }

    // Get the price ID from the subscription
    const priceId = subscription.items.data[0].price.id;

    // Fetch the price with expanded product
    const price = await stripe.prices.retrieve(priceId, {
      expand: ['product'],
    });

    // Get the product data
    const product = price.product as any;

    return {
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
    };
  } catch (error) {
    // More detailed error logging
    // console.error('Error in getSubscriptionAction:', {
    //   error,
    //   message: error instanceof Error ? error.message : 'Unknown error',
    //   stack: error instanceof Error ? error.stack : undefined,
    // });
    return { error: 'Error fetching subscription details' };
  }
} 