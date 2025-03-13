import { Footer } from "@/components/footer/footer";
import { Hero } from "@/components/hero";
import { Pricing } from "@/components/price";
import { Team } from "@/components/team/team";
import { Faqs } from "@/components/faqs";
import { Nav } from "@/components/nav";
import { auth } from "@/auth";
import { getSubscriptionAction } from "@/actions/subscription-actions";

export default async function Home() {
  const session = await auth();
  const { subscription, error } = await getSubscriptionAction();

  // Show pricing in these cases:
  // 1. User is not logged in
  // 2. User is logged in but has no subscription
  // 3. User's subscription is not active
  const shouldShowPricing = !session || !subscription || subscription.status !== "active";

  return (
    <>
      <Nav session={session} />
      <div className="mt-40">
        <Hero session={session} />
        <Team />
        {shouldShowPricing && (
          <Pricing session={session} />
        )}
        <Faqs />
      </div>
      <Footer />
    </>
  );
}
