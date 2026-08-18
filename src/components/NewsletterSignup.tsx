"use client";

import { useState } from "react";

/** The one place the app asks for an email — an optional newsletter, per spec.
 *  Stored nowhere, sent nowhere. */
export function NewsletterSignup() {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);

  if (done) {
    return (
      <p className="text-sm text-veg">
        You&rsquo;re on a list that sends nothing. On brand, honestly.
      </p>
    );
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (email.includes("@")) setDone(true);
      }}
      className="flex max-w-sm gap-2"
    >
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="you@email.com (optional)"
        aria-label="Email for the newsletter"
        className="tnum min-w-0 flex-1 rounded-lg border border-line/15 bg-card/60 px-3 py-2 text-sm text-fg outline-none placeholder:text-dim focus:border-bandhani"
      />
      <button type="submit" className="rounded-lg border border-line/20 px-3.5 py-2 text-sm font-semibold text-fg hover:border-line/40">
        Notify me of nothing
      </button>
    </form>
  );
}
