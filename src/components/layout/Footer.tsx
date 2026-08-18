import Link from "next/link";
import { BRAND } from "@/lib/brand";
import { Logo } from "@/components/Logo";
import { NewsletterSignup } from "@/components/NewsletterSignup";

const LINKS = [
  { href: "/about", label: "About" },
  { href: "/credits", label: "Credits" },
  { href: "/contact", label: "Contact / takedown" },
  { href: "/orders", label: "Your orders" },
];

export function Footer() {
  return (
    <footer className="mt-auto border-t border-line/10 bg-card/60">
      <div className="mx-auto w-full max-w-5xl px-5 py-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <Link href="/" aria-label={`${BRAND.name} — home`}>
            <Logo className="text-lg" full />
          </Link>
          <nav className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-dim">
            {LINKS.map((l) => (
              <Link key={l.href} href={l.href} className="hover:text-fg">
                {l.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="mt-6">
          <p className="mb-2 text-sm text-muted">Get updates we&rsquo;ll never send</p>
          <NewsletterSignup />
        </div>

        <p className="mt-6 max-w-2xl text-xs leading-relaxed text-dim">
          {BRAND.disclaimer} Iconic restaurants are named descriptively and factually — no logos, no
          brand colours, no implied partnership. Other listings are fictional cloud kitchens.
        </p>
      </div>
    </footer>
  );
}
