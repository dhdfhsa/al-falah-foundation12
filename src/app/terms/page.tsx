import type { Metadata } from "next";
import { SITE_NAME, siteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: `Terms of Use | ${SITE_NAME}`,
  description: `Terms of Use for ${SITE_NAME}.`,
  alternates: {
    canonical: "/terms",
  },
};

export default function TermsPage() {
  return (
    <main style={{ padding: "6rem 1.5rem", maxWidth: "900px", margin: "0 auto" }}>
      <h1>Terms of Use</h1>
      <p>
        These terms cover how visitors, donors, and members may use the Al Falah Foundation
        website and related services.
      </p>
      <p>
        We can replace this starter page with a full legal terms document whenever you are ready.
      </p>
      <p>
        Visit our <a href={siteUrl("/")}>home page</a> or <a href={siteUrl("/register")}>register</a>.
      </p>
    </main>
  );
}
