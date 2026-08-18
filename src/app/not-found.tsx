import Link from "next/link";
import { Footer } from "@/components/layout/Footer";

export default function NotFound() {
  return (
    <>
      <main className="flex flex-1 flex-col items-center justify-center px-6 py-24 text-center">
        <p className="tnum font-display text-7xl text-bandhani">404</p>
        <h1 className="mt-4 font-display text-3xl text-fg">Page never came either.</h1>
        <p className="mt-2 max-w-sm text-dim">
          We looked. The rider looked. It&rsquo;s just not here. Same as your dabba.
        </p>
        <Link
          href="/"
          className="mt-8 rounded-xl bg-bandhani px-6 py-3 font-medium text-fg shadow-pop transition active:scale-95"
        >
          Back to not ordering
        </Link>
      </main>
      <Footer />
    </>
  );
}
