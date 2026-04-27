import Hero from "@/components/Hero";
import AboutSection from "@/components/AboutSection";
import ScrollReveal from "@/components/ScrollReveal";

export default function Home() {
  return (
    <main>
      <ScrollReveal variant="fade">
        <Hero />
      </ScrollReveal>
      <ScrollReveal variant="up" delayMs={120}>
        <AboutSection />
      </ScrollReveal>
    </main>
  );
}
