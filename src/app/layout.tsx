// app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import {
  SITE_DESCRIPTION,
  SITE_KEYWORDS,
  SITE_NAME,
  SITE_URL,
  SOCIAL_PROFILES,
  SUPPORT_ADDRESS,
  SUPPORT_EMAIL,
  SUPPORT_PHONE,
  siteUrl,
} from "@/lib/site";


export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  applicationName: SITE_NAME,
  title: {
    default: SITE_NAME,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  keywords: SITE_KEYWORDS,
  authors: [{ name: SITE_NAME }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
      "max-video-preview": -1,
    },
  },
  verification: {
    google: "YDFDfDonRuYqPvSV-LK3icnw8WTEHtZI7ejM72KOlcM",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl("/"),
    siteName: SITE_NAME,
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: `${SITE_NAME} social preview`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    images: ["/twitter-image"],
  },
  icons: {
    icon: "/al-falah-logo.png",
    shortcut: "/al-falah-logo.png",
    apple: "/al-falah-logo.png",
  },
  category: "nonprofit",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-theme="dark">
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: SITE_NAME,
              url: siteUrl("/"),
              logo: siteUrl("/al-falah-logo.png"),
              description: SITE_DESCRIPTION,
              email: SUPPORT_EMAIL,
              telephone: SUPPORT_PHONE,
              address: {
                "@type": "PostalAddress",
                streetAddress: SUPPORT_ADDRESS,
                addressLocality: "Gazipur",
                addressCountry: "BD",
              },
              contactPoint: [
                {
                  "@type": "ContactPoint",
                  contactType: "donations and community support",
                  email: SUPPORT_EMAIL,
                  telephone: SUPPORT_PHONE,
                  availableLanguage: ["en", "bn"],
                },
              ],
              sameAs: SOCIAL_PROFILES,
            }),
          }}
        />
        <Navbar />

        {children}
      </body>
    </html>
  );
}
