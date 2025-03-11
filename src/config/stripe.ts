import { stripe } from "@/lib/stripe";

export type ProductWithPrices = {
  id: string;
  name: string;
  prices: {
    yearly: string;
    quarterly: string;
  };
};

export type ProductPriceMap = {
  [key: string]: ProductWithPrices;
};

// Cache the products and prices in memory
let CACHED_PRICES: ProductPriceMap | null = null;

export async function getStripePrices(): Promise<ProductPriceMap> {
  if (CACHED_PRICES) {
    return CACHED_PRICES;
  }

  try {
    // Fetch all active products with their prices
    const products = await stripe.products.list({
      active: true,
      expand: ['data.default_price'],
    });

    // Fetch all prices with expanded product data
    const prices = await stripe.prices.list({
      active: true,
      expand: ['data.product'],
      limit: 100
    });

    const priceMap: ProductPriceMap = {};

    // Create a map of products with their prices
    products.data.forEach((product) => {
      const productId = product.id;
      const productPrices = prices.data.filter(
        (price) => typeof price.product === 'string' 
          ? price.product === productId 
          : price.product.id === productId
      );

      const yearlyPrice = productPrices.find(
        (price) => price.recurring?.interval === 'year'
      );
      const quarterlyPrice = productPrices.find(
        (price) => price.recurring?.interval === 'month' && price.recurring.interval_count === 3
      );

      if (yearlyPrice || quarterlyPrice) {
        priceMap[productId] = {
          id: productId,
          name: product.name,
          prices: {
            yearly: yearlyPrice?.id || '',
            quarterly: quarterlyPrice?.id || '',
          },
        };
      }
    });

    CACHED_PRICES = priceMap;
    return priceMap;
  } catch (error) {
    console.error('Error fetching Stripe prices:', error);
    throw error;
  }
}

// Function to invalidate the cache if needed (e.g., after webhook events)
export function invalidateStripeCache() {
  CACHED_PRICES = null;
} 