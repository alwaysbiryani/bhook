"use client";

import Link from "next/link";

export default function Error({ reset }: { error: Error; reset: () => void }) {
  return (
    <main className="mx-auto flex w-full max-w-md flex-1 flex-col items-center justify-center px-6 py-24 text-center">
      <p className="font-display text-6xl text-bandhani">Oops</p>
      <h1 className="mt-4 font-display text-2xl text-chalk">Something didn&rsquo;t come through.</h1>
      <p className="mt-2 max-w-sm text-steel-dim">
        Fittingly, this page also failed to arrive. Nothing was charged, because nothing ever is.
      </p>
      <div className="mt-8 flex gap-3">
        <button
          onClick={reset}
          className="rounded-xl bg-bandhani px-6 py-3 font-medium text-chalk shadow-pop transition active:scale-95"
        >
          Try again
        </button>
        <Link href="/" className="rounded-xl border border-steel/20 px-6 py-3 font-medium text-chalk">
          Back home
        </Link>
      </div>
    </main>
  );
}
