import Link from "next/link";
import { BRAND } from "@/lib/brand";

const LINKS = [
  { href: "/about", label: "About" },
  { href: "/credits", label: "Credits" },
  { href: "/contact", label: "Contact / takedown" },
  { href: "/orders", label: "Your orders" },
];

export function Footer() {
  return (
    <footer className="mt-auto border-t border-steel/10 bg-ink-2/60">
      <div className="mx-auto w-full max-w-5xl px-5 py-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <Link href="/" className="font-display text-lg text-chalk">
            {BRAND.name}
          </Link>
          <nav className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-steel-dim">
            {LINKS.map((l) => (
              <Link key={l.href} href={l.href} className="hover:text-chalk">
                {l.label}
              </Link>
            ))}
          </nav>
        </div>
        <p className="mt-6 max-w-2xl text-xs leading-relaxed text-steel-dim">
          {BRAND.disclaimer} Restaurant names are used descriptively and factually — no logos, no
          brand colours, no implied partnership.
        </p>
      </div>
    </footer>
  );
}
