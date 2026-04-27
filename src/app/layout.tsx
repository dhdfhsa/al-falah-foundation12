// app/layout.tsx
import type { Metadata } from "next";
import { DM_Sans, Cinzel } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-dm",
});

const cinzel = Cinzel({
  subsets: ["latin"],
  weight: ["500", "700"],
  variable: "--font-cinzel",
});

export const metadata: Metadata = {
  title: "Al Falah Foundation",
  description: "Service to Creation, Service to the Creator",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${dmSans.variable} ${cinzel.variable}`}>
      <body>
        <Navbar />
        {children}
      </body>
    </html>
  );
}
