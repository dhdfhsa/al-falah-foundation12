import Hero from "@/components/Hero";
import AboutSection from "@/components/AboutSection";
import ScrollReveal from "@/components/ScrollReveal";
import ProgramsSection from "@/components/ProgramsSection";
import LeaderMessage from "@/components/LeaderMessage";
import Footer from "@/components/Footer";
import ContactBar from "@/components/Contact";
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
