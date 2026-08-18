"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { TrackMap } from "@/components/track/TrackMap";
import { useStore } from "@/store/useStore";
import { getRestaurant, RIDERS, RIDER_PINGS } from "@/data";
import { play } from "@/lib/sound";

const DURATION = 48_000; // ms — the whole "delivery"

const PINGS: { p: number; text: string }[] = [
  { p: 0.16, text: RIDER_PINGS[0] },
  { p: 0.32, text: RIDER_PINGS[1] },
  { p: 0.5, text: RIDER_PINGS[2] },
  { p: 0.66, text: RIDER_PINGS[3] },
  { p: 0.8, text: RIDER_PINGS[4] },
  { p: 0.92, text: RIDER_PINGS[5] },
];

const STEPS = ["Confirmed", "In the kitchen", "Picked up", "On the way", "Arriving"];

function mmss(ms: number) {
  const s = Math.max(0, Math.ceil(ms / 1000));
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
}

export default function TrackPage() {
  const { orderId } = useParams<{ orderId: string }>();
  const router = useRouter();
  const order = useStore((s) => s.orders.find((o) => o.id === orderId));
  const markDelivered = useStore((s) => s.markDelivered);
  const addLine = useStore((s) => s.addLine);

  const [now, setNow] = useState(() => Date.now());
  const [rang, setRang] = useState(false);
  const [rated, setRated] = useState(0);

  const deliveredAt = order ? order.placedAt + DURATION : 0;
  const alreadyDelivered = order?.status === "delivered";
  const remaining = alreadyDelivered ? 0 : Math.max(0, deliveredAt - now);
  const progress = alreadyDelivered ? 1 : Math.min(1, 1 - remaining / DURATION);
  const delivered = progress >= 1;

  // tick
  useEffect(() => {
    if (!order || alreadyDelivered) return;
    const t = setInterval(() => setNow(Date.now()), 250);
    return () => clearInterval(t);
  }, [order, alreadyDelivered]);

  // fire the twist once
  useEffect(() => {
    if (order && delivered && order.status !== "delivered" && !rang) {
      setRang(true);
      markDelivered(order.id);
      play("doorbell");
      if (typeof navigator !== "undefined" && navigator.vibrate) navigator.vibrate([30, 60, 30, 60]);
    }
  }, [order, delivered, rang, markDelivered]);

  const rider = order ? RIDERS.find((r) => r.id === order.riderId) : undefined;
  const restaurant = order ? getRestaurant(order.restaurantSlug) : undefined;
  const shownPings = useMemo(() => PINGS.filter((p) => progress >= p.p), [progress]);
  const stepIndex = Math.min(STEPS.length - 1, Math.floor(progress * STEPS.length));

  if (!order || !rider || !restaurant) {
    return (
      <>
        <SiteHeader />
        <main className="mx-auto flex w-full max-w-md flex-1 flex-col items-center justify-center px-6 py-24 text-center">
          <h1 className="font-display text-3xl text-fg">This order also never came.</h1>
          <p className="mt-2 text-dim">We couldn&rsquo;t find it. Which is thematically consistent.</p>
          <Link href="/" className="mt-8 rounded-xl bg-bandhani px-6 py-3 font-medium text-fg">Back home</Link>
        </main>
      </>
    );
  }

  const reorder = () => {
    for (const l of order.lines) addLine(l.dishSlug, order.restaurantSlug, l.selection, l.qty);
    router.push("/cart");
  };

  return (
    <>
      <SiteHeader cityName={restaurant.area} />
      <main className="mx-auto w-full max-w-md flex-1 px-5 py-5">
        {/* Map */}
        <div className="overflow-hidden rounded-2xl border border-line/10">
          <TrackMap progress={progress} riderHue={rider.avatarHue} className="h-56 w-full" />
        </div>

        {/* ETA / status */}
        <div className="mt-4 flex items-center justify-between">
          <div>
            {delivered ? (
              <h1 className="font-display text-2xl text-veg">Delivered ✓</h1>
            ) : (
              <>
                <p className="text-xs uppercase tracking-wider text-dim">{STEPS[stepIndex]}</p>
                <h1 className="font-display text-2xl text-fg">
                  Arriving in <span className="tnum text-bandhani">{mmss(remaining)}</span>
                </h1>
              </>
            )}
          </div>
          {!delivered && (
            <div className="text-right">
              <p className="text-xs text-dim">Your OTP</p>
              <div className="mt-1 flex gap-1">
                {order.otp.split("").map((d, i) => (
                  <span key={i} className="tnum grid h-8 w-7 place-items-center rounded-md bg-card text-lg font-bold text-turmeric-text">
                    {d}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* progress ladder */}
        {!delivered && (
          <div className="mt-4 flex gap-1.5">
            {STEPS.map((s, i) => (
              <div key={s} className={`h-1.5 flex-1 rounded-full ${i <= stepIndex ? "bg-bandhani" : "bg-steel/15"}`} />
            ))}
          </div>
        )}

        {/* Rider card */}
        <div className="mt-4 flex items-center gap-3 rounded-2xl border border-line/10 bg-card/60 p-3.5">
          <div className="grid h-12 w-12 shrink-0 place-items-center rounded-full text-lg font-bold text-fg" style={{ background: `hsl(${rider.avatarHue} 60% 60%)` }}>
            {rider.name[0]}
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-semibold text-fg">{rider.name}</p>
            <p className="text-xs text-dim">
              <span className="tnum">{rider.rating}</span> ★ · {rider.vehicle}
            </p>
          </div>
          <div className="flex gap-2">
            <button className="grid h-9 w-9 place-items-center rounded-full border border-line/20 text-muted" aria-label="Call rider" onClick={() => play("pop")}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3-8.6A2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.2a2 2 0 0 1 2.1-.5c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2z" /></svg>
            </button>
          </div>
        </div>

        {/* Chat pings */}
        <div className="mt-4 space-y-2">
          <AnimatePresence initial={false}>
            {delivered && (
              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="flex justify-center">
                <span className="rounded-full bg-veg/15 px-3 py-1 text-xs text-veg">OTP verified · handed over</span>
              </motion.div>
            )}
            {[...shownPings].reverse().map((p) => (
              <motion.div
                key={p.p}
                initial={{ opacity: 0, y: 10, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ type: "spring", damping: 22, stiffness: 300 }}
                className="max-w-[80%] rounded-2xl rounded-tl-sm bg-card px-3.5 py-2 text-sm text-fg"
              >
                <span className="mb-0.5 block text-[11px] text-dim">{rider.name}</span>
                {p.text}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Delivered actions */}
        {delivered && (
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="mt-6">
            <div className="rounded-2xl border border-line/10 bg-card/60 p-4 text-center">
              <p className="text-muted">
                Your food from <span className="text-fg">{restaurant.name}</span> was &ldquo;delivered&rdquo;.
              </p>
              <p className="mt-1 text-sm text-dim">It has quietly moved to your order history. The photo is empty. So is the box.</p>

              {/* rate rider */}
              <div className="mt-4">
                <p className="text-sm text-muted">Rate {rider.name}</p>
                <div className="mt-1.5 flex justify-center gap-1">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <button key={n} onClick={() => { setRated(n); play("pop"); }} aria-label={`${n} stars`}>
                      <svg width="28" height="28" viewBox="0 0 24 24" fill={n <= rated ? "var(--color-turmeric)" : "none"} stroke="var(--color-turmeric)" strokeWidth="1.5">
                        <path d="M12 2l2.9 6.3 6.9.7-5.1 4.6 1.4 6.8L12 17.8 5.9 20.4l1.4-6.8L2.2 9l6.9-.7z" />
                      </svg>
                    </button>
                  ))}
                </div>
                {rated > 0 && <p className="mt-1 text-xs text-turmeric-text">Thanks. It changes nothing, but thanks.</p>}
              </div>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3">
              <button onClick={reorder} className="rounded-xl bg-bandhani px-4 py-3.5 font-semibold text-fg shadow-pop transition active:scale-[0.98]">
                Reorder
              </button>
              <Link href="/orders" className="grid place-items-center rounded-xl border border-line/20 px-4 py-3.5 font-semibold text-fg">
                Your orders
              </Link>
            </div>
          </motion.div>
        )}
      </main>
    </>
  );
}
