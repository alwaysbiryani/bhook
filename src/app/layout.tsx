import type { Metadata, Viewport } from "next";
import { Kalnia, Onest, Geist_Mono, Tiro_Devanagari_Hindi } from "next/font/google";
import "./globals.css";
import { AppChromeLazy } from "@/components/AppChromeLazy";

const kalnia = Kalnia({
  variable: "--font-kalnia",
  subsets: ["latin"],
  display: "swap",
  // Display text only ever uses weight 400 — ship one static instance, not the
  // full variable file, so the hero font arrives sooner (and stays on-brand).
  weight: "400",
});

const onest = Onest({
  variable: "--font-onest",
  subsets: ["latin"],
  display: "swap",
  // Body text isn't the LCP — don't let it compete with the hero font for the
  // preload budget on a throttled connection.
  preload: false,
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
  preload: false,
});

const tiroDeva = Tiro_Devanagari_Hindi({
  variable: "--font-tiro-deva",
  subsets: ["devanagari", "latin"],
  weight: "400",
  display: "swap",
  // Devanagari is secondary text — don't block the critical path preloading it.
  preload: false,
});

const SITE = "Dabba Never Comes";
const TAGLINE = "Order the feeling. Skip the food.";

export const metadata: Metadata = {
  metadataBase: new URL("https://dabbanevercomes.app"),
  title: {
    default: `${SITE} — ${TAGLINE}`,
    template: `%s · ${SITE}`,
  },
  description:
    "Browse real dishes from India's most iconic restaurants, fill your cart, stack every coupon, pay ₹0, and track a rider who never arrives. A parody. No real food, no real payment, no real charge.",
  applicationName: SITE,
  appleWebApp: { capable: true, title: SITE, statusBarStyle: "black-translucent" },
  openGraph: { title: SITE, description: TAGLINE, siteName: SITE, type: "website" },
  icons: {
    icon: [{ url: "/icon.svg", type: "image/svg+xml" }],
    apple: [{ url: "/icon.svg" }],
  },
};

export const viewport: Viewport = {
  themeColor: "#0c1512",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${kalnia.variable} ${onest.variable} ${geistMono.variable} ${tiroDeva.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {children}
        <AppChromeLazy />
      </body>
    </html>
  );
}
