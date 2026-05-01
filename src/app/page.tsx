import type { Metadata } from "next";
import Hero from "@/components/Hero";
import AboutSection from "@/components/AboutSection";
import ScrollReveal from "@/components/ScrollReveal";
import ProgramsSection from "@/components/ProgramsSection";
import LeaderMessage from "@/components/LeaderMessage";
import Footer from "@/components/Footer";
import ContactBar from "@/components/Contact";
import { SITE_DESCRIPTION, SITE_NAME, siteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "Charity, Relief & Education in Bangladesh",
  description: SITE_DESCRIPTION,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: `${SITE_NAME} | Charity, Relief & Education in Bangladesh`,
    description: SITE_DESCRIPTION,
    url: siteUrl("/"),
    images: ["/opengraph-image"],
  },
  twitter: {
    title: `${SITE_NAME} | Charity, Relief & Education in Bangladesh`,
    description: SITE_DESCRIPTION,
    images: ["/twitter-image"],
  },
};

export default function Home() {
  return (
    <main>
      <ScrollReveal variant="fade">
        <Hero />
      </ScrollReveal>
      <ScrollReveal variant="up" delayMs={120}>
        <AboutSection />
      </ScrollReveal>

      <ScrollReveal variant="fade" delayMs={180}>
        <ProgramsSection />
      </ScrollReveal>

      <LeaderMessage />
<ContactBar/>
      <Footer />

    </main>
  );
}
