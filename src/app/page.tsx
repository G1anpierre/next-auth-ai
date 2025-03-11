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

  return (
    <>
      <Nav session={session} />
      <div className="mt-40">
        <Hero session={session} />
        <Team />
        {subscription?.status !== "active" && (
          <Pricing session={session} />
        )}
        <Faqs />
      </div>
      <Footer />
    </>
  );
}
