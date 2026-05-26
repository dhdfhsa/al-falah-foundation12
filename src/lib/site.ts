export const SITE_NAME = "al falah foundation";

export const SITE_DESCRIPTION =
  "Al Falah Foundation is a Bangladesh-based charitable organization serving communities through education, food aid, healthcare, orphan care, clean water, and emergency relief.";

const rawSiteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  process.env.VERCEL_PROJECT_PRODUCTION_URL ??
  process.env.VERCEL_URL ??
  "http://localhost:3000";

const normalizedSiteUrl =
  rawSiteUrl.startsWith("http://") || rawSiteUrl.startsWith("https://")
    ? rawSiteUrl
    : `https://${rawSiteUrl}`;

export const SITE_URL = normalizedSiteUrl.replace(/\/$/, "");

export const SITE_KEYWORDS = [
  "Al Falah Foundation",
  "Al Falah Foundation Gazipur",
  "Al Falah Foundation gazipur",
  "al falah foundation",
  "al falah foundation gazipur",
  "Bangladesh charity",
  "Islamic charity",
  "education support",
  "food relief",
  "medical camp",
  "orphan care",
  "clean water",
  "community development",
  "donate Bangladesh",
];

export const SOCIAL_PROFILES = [
  "https://www.facebook.com/profile.php?id=100091759538437",
  "https://www.instagram.com/its_falahh?igsh=MTc1a2FmczRuemhwYQ==",
];

export const SUPPORT_EMAIL = "alfalahfoundation2019@gmail.com";
export const SUPPORT_PHONE = "+8801824129883";
export const SUPPORT_ADDRESS = "Joydepur, Gazipur, Bangladesh";

export function siteUrl(path = "/"): string {
  return new URL(path, SITE_URL).toString();
}
