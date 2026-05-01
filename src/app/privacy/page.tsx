import type { Metadata } from "next";
import { SITE_NAME, siteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: `Privacy Policy | ${SITE_NAME}`,
  description: `Privacy Policy for ${SITE_NAME}.`,
  alternates: {
    canonical: "/privacy",
  },
};

export default function PrivacyPage() {
  return (
    <main style={{ padding: "6rem 1.5rem", maxWidth: "900px", margin: "0 auto" }}>
      <h1>Privacy Policy</h1>
      <p>
        This page explains how Al Falah Foundation handles personal information, donations,
        and contact details collected through the website.
      </p>
      <p>
        If you need a formal policy tailored to your operations, we can expand this page with
        the exact data retention and cookie practices used by the site.
      </p>
      <p>
        Visit our <a href={siteUrl("/")}>home page</a> or <a href={siteUrl("/donate")}>donation page</a>.
      </p>
    </main>
  );
}
