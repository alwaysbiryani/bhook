import { Footer } from "@/components/layout/Footer";
import { BRAND } from "@/lib/brand";

export default function Home() {
  return (
    <>
      <main className="flex flex-1 flex-col items-center justify-center px-6 py-24 text-center">
        <span className="mb-5 rounded-full border border-turmeric/40 bg-turmeric/10 px-3 py-1 text-xs font-medium tracking-wide text-turmeric">
          Phase 0 · foundation live
        </span>
        <h1 className="font-display text-5xl leading-[1.05] text-chalk sm:text-7xl">
          {BRAND.name}
        </h1>
        <p className="mt-4 max-w-md text-balance text-lg text-steel">
          {BRAND.tagline}
        </p>

        <div className="mt-10 flex items-center gap-3">
          <button className="rounded-xl bg-bandhani px-6 py-3 font-medium text-chalk shadow-pop transition active:scale-95">
            Pay <span className="tnum">₹0</span>
          </button>
          <span className="tnum rounded-xl border border-steel/15 px-6 py-3 text-steel">
            ₹42,380 not spent
          </span>
        </div>

        <p className="font-deva mt-12 text-2xl text-steel-dim">
          बाहर हूँ। गेट नंबर?
        </p>
      </main>
      <Footer />
    </>
  );
}
