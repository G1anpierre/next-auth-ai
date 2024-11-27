import { Footer } from "@/components/footer/footer";
import { Hero } from "@/components/hero";
import { Pricing } from "@/components/price";
import { Team } from "@/components/team/team";
import { Faqs } from "@/components/faqs";
export default function Home() {
  return (
    <div className="mt-40">
      <Hero />
      <Team />
      <Pricing />
      <Faqs />
      <Footer />
    </div>
  );
}
