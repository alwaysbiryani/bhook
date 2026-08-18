"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

interface BIPEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: string }>;
}

/** Registers the service worker and shows a subtle install prompt when the browser
 *  offers one. Dismissible; remembers dismissal for the session. */
export function PWARegister() {
  const [deferred, setDeferred] = useState<BIPEvent | null>(null);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(() => {});
    }
    const onBIP = (e: Event) => {
      e.preventDefault();
      setDeferred(e as BIPEvent);
    };
    window.addEventListener("beforeinstallprompt", onBIP);
    return () => window.removeEventListener("beforeinstallprompt", onBIP);
  }, []);

  const install = async () => {
    if (!deferred) return;
    await deferred.prompt();
    await deferred.userChoice;
    setDeferred(null);
  };

  return (
    <AnimatePresence>
      {deferred && !dismissed && (
        <motion.div
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          className="fixed inset-x-0 bottom-24 z-30 mx-auto flex w-full max-w-md items-center gap-3 rounded-2xl border border-line/15 bg-card px-4 py-3 shadow-pop"
          style={{ marginLeft: "auto", marginRight: "auto", left: 16, right: 16 }}
        >
          <img src="/icon.svg" alt="" width={36} height={36} className="rounded-lg" />
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-fg">Install Dabba Never Comes</p>
            <p className="text-xs text-dim">Craving on tap. Still no food.</p>
          </div>
          <button onClick={install} className="rounded-lg bg-bandhani px-3.5 py-1.5 text-sm font-semibold text-fg">Install</button>
          <button onClick={() => setDismissed(true)} className="text-dim" aria-label="Dismiss">✕</button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
