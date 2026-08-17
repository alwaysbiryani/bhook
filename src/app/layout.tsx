import type { Metadata, Viewport } from "next";
import { Kalnia, Onest, Geist_Mono, Tiro_Devanagari_Hindi } from "next/font/google";
import "./globals.css";

const kalnia = Kalnia({
  variable: "--font-kalnia",
  subsets: ["latin"],
  display: "swap",
});

const onest = Onest({
  variable: "--font-onest",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

const tiroDeva = Tiro_Devanagari_Hindi({
  variable: "--font-tiro-deva",
  subsets: ["devanagari", "latin"],
  weight: "400",
  display: "swap",
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
    "Browse real dishes from India's most iconic restaurants, fill your thali, stack every coupon, pay ₹0, and track a rider who never arrives. A parody. No real food, no real payment, no real charge.",
  applicationName: SITE,
  appleWebApp: { capable: true, title: SITE, statusBarStyle: "black-translucent" },
  openGraph: { title: SITE, description: TAGLINE, siteName: SITE, type: "website" },
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
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
