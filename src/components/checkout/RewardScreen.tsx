"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ScratchCard } from "./ScratchCard";
import { TierLadder } from "./TierLadder";
import { PriceTicker } from "@/components/PriceTicker";
import { useStore } from "@/store/useStore";
import { inr } from "@/lib/format";
import { play } from "@/lib/sound";

export function RewardScreen({
  orderId,
  saved,
  restaurantName,
}: {
  orderId: string;
  saved: number;
  restaurantName: string;
}) {
  const router = useRouter();
  const lifetimeSaved = useStore((s) => s.lifetimeSaved);
  const orderCount = useStore((s) => s.orders.length);
  const [revealed, setRevealed] = useState(false);
  const firedRef = useRef(false);

  const fireConfetti = async () => {
    if (firedRef.current) return;
    firedRef.current = true;
    play("coupon");
    try {
      const mod = await import("canvas-confetti");
      const confetti = mod.default;
      const colors = ["#f5b301", "#d6336c", "#1b4d3e", "#faf8f3"];
      confetti({ particleCount: 90, spread: 78, origin: { y: 0.5 }, colors });
      setTimeout(() => confetti({ particleCount: 60, angle: 60, spread: 60, origin: { x: 0, y: 0.6 }, colors }), 180);
      setTimeout(() => confetti({ particleCount: 60, angle: 120, spread: 60, origin: { x: 1, y: 0.6 }, colors }), 320);
    } catch {
      /* confetti is optional flourish */
    }
  };

  useEffect(() => {
    if (typeof navigator !== "undefined" && navigator.vibrate) navigator.vibrate(20);
  }, []);

  return (
    <main className="mx-auto w-full max-w-md flex-1 px-5 py-8">
      <p className="text-center text-sm text-turmeric">Order placed · never dispatched</p>
      <h1 className="mt-1 text-center font-display text-3xl text-chalk">Here&rsquo;s your reward</h1>

      <div className="mt-6">
        <ScratchCard
          className="aspect-[16/10] border border-turmeric/30 bg-ink-2"
          onReveal={() => {
            setRevealed(true);
            fireConfetti();
          }}
        >
          <div>
            <p className="text-sm font-medium text-steel">You saved</p>
            <PriceTicker value={saved} className="font-display text-5xl text-turmeric" />
            <p className="mt-1 text-sm text-steel-dim">— again.</p>
          </div>
        </ScratchCard>
      </div>

      {/* Lifetime counter */}
      <div className="mt-5 rounded-2xl border border-steel/10 bg-ink-2/60 p-4 text-center">
        <p className="text-xs uppercase tracking-wider text-steel-dim">Lifetime</p>
        <p className="tnum mt-1 font-display text-2xl text-chalk">
          ₹{inr(lifetimeSaved)} <span className="text-steel">not spent</span>
        </p>
        <p className="mt-0.5 text-sm text-steel-dim">
          <span className="tnum">{orderCount}</span> order{orderCount === 1 ? "" : "s"} never delivered
        </p>
      </div>

      {/* Tier ladder */}
      <div className="mt-5">
        <TierLadder orders={orderCount} />
      </div>

      <button
        type="button"
        onClick={() => router.push(`/track/${orderId}`)}
        className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-bandhani px-5 py-4 text-base font-semibold text-chalk shadow-pop transition active:scale-[0.99]"
      >
        Track your rider
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden>
          <path d="M9 6l6 6-6 6" />
        </svg>
      </button>
      <p className="mt-3 text-center text-xs text-steel-dim">
        {revealed ? `Ramesh is "leaving" ${restaurantName} now.` : "Scratch the card first. Go on."}
      </p>
    </main>
  );
}
