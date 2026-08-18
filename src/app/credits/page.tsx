import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { Footer } from "@/components/layout/Footer";

export const metadata: Metadata = { title: "Credits" };

export default function Credits() {
  return (
    <>
      <SiteHeader />
      <main className="mx-auto w-full max-w-2xl flex-1 px-5 py-12">
        <h1 className="font-display text-4xl text-chalk">Credits</h1>
        <div className="mt-6 space-y-4 leading-relaxed text-steel">
          <p>
            All dish artwork on this site is <strong>original illustration</strong> — layered SVG
            generated in-app, in our own palette. No photographs are used, hotlinked, or scraped from
            any restaurant, aggregator, or search engine.
          </p>
          <p>
            The iconic restaurants are named descriptively and factually to identify well-known, real
            establishments. No logos, brand colours, or trademarks are reproduced, and no affiliation or
            partnership is implied or exists. Every other listing — the &ldquo;cloud kitchens&rdquo; that
            fill out each city — is entirely fictional: invented names, invented menus, invented reviews.
            Any resemblance to a real business is coincidental.
          </p>
          <h2 className="pt-4 font-display text-xl text-chalk">Type</h2>
          <p className="text-sm text-steel-dim">
            Kalnia, Tiro Devanagari Hindi, Onest, and Geist Mono — all open-source, served via Google
            Fonts.
          </p>
          <h2 className="pt-4 font-display text-xl text-chalk">A note</h2>
          <p className="text-sm text-steel-dim">
            If you represent a restaurant named here and would like your name removed, see the{" "}
            <Link href="/contact" className="text-bandhani hover:underline">
              contact / takedown
            </Link>{" "}
            page. We&rsquo;ll act quickly.
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}
