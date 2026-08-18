import type { Metadata } from "next";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { Footer } from "@/components/layout/Footer";

export const metadata: Metadata = { title: "Contact / takedown" };

export default function Contact() {
  return (
    <>
      <SiteHeader />
      <main className="mx-auto w-full max-w-2xl flex-1 px-5 py-12">
        <h1 className="font-display text-4xl text-fg">Contact &amp; takedown</h1>
        <div className="mt-6 space-y-4 leading-relaxed text-muted">
          <p>
            This is a parody. If you represent a restaurant named on this site and want your name
            removed, or you have any other concern, write to us and we&rsquo;ll act quickly — usually
            within a couple of days.
          </p>
          <p className="rounded-xl border border-line/15 bg-card/60 p-4">
            <span className="text-dim">Email</span>
            <br />
            <a href="mailto:hello@dabbanevercomes.app" className="tnum text-lg text-bandhani hover:underline">
              hello@dabbanevercomes.app
            </a>
          </p>
          <p className="text-sm text-dim">
            No real food, no real payment, no real charge. We collect no card, no phone number, and no
            email except an optional newsletter you have to ask for.
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}
