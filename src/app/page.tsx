import { Footer } from "@/components/footer/footer";
import { Hero } from "@/components/hero";
import { Pricing } from "@/components/price";
import { Team } from "@/components/team/team";
import { Faqs } from "@/components/faqs";
import { Nav } from "@/components/nav";

export default function Home() {
  return (
    <>
      <Nav />
      <div className="mt-40">
        <Hero />
        <Team />
        <Pricing />
        <Faqs />
      </div>
      <Footer />
    </>
  );
}
