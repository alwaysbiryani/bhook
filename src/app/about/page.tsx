import type { Metadata } from "next";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { Footer } from "@/components/layout/Footer";
import { BRAND } from "@/lib/brand";

export const metadata: Metadata = { title: "About" };

export default function About() {
  return (
    <>
      <SiteHeader />
      <main className="mx-auto w-full max-w-2xl flex-1 px-5 py-12">
        <h1 className="font-display text-4xl text-chalk">{BRAND.name}</h1>
        <div className="mt-6 space-y-4 leading-relaxed text-steel">
          <p>
            {BRAND.name} is a place to buy the <em>feeling</em> of ordering food — the deal-hunt, the
            coupon stack, the &ldquo;Pay&rdquo; tap, the chime, the rider on the map — without the food,
            the payment, or the charge.
          </p>
          <p>
            You browse real dishes from India&rsquo;s most iconic kitchens, fill a cart, watch the
            bill climb, apply every coupon (they all work, they all stack), pay <span className="tnum">₹0</span>{" "}
            over UPI, scratch a card, and track a rider named Ramesh who is always <em>bahar</em> and never
            quite here.
          </p>
          <p>Nothing is charged. No account, no card, no backend. The dabba never comes. That&rsquo;s the point.</p>
          <p className="text-sm text-steel-dim">{BRAND.disclaimer}</p>
        </div>
      </main>
      <Footer />
    </>
  );
}
