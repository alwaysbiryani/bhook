"use client";

import dynamic from "next/dynamic";

/** The global overlays (sheets, floating cart, search, PWA prompt) all pull in
 *  Framer Motion and are only needed after interaction. Loading them lazily,
 *  client-only, keeps Framer Motion out of the first-load bundle. */
const AppChrome = dynamic(() => import("./AppChrome").then((m) => m.AppChrome), {
  ssr: false,
});

export function AppChromeLazy() {
  return <AppChrome />;
}
