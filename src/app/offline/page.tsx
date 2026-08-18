import type { Metadata } from "next";
import Link from "next/link";
import { Thali } from "@/components/thali/Thali";

export const metadata: Metadata = { title: "Offline" };

export default function Offline() {
  return (
    <main className="mx-auto flex w-full max-w-md flex-1 flex-col items-center justify-center px-6 py-24 text-center">
      <div className="h-32 w-32 opacity-90">
        <Thali filled={0} weight={0} className="h-full w-full" />
      </div>
      <h1 className="mt-6 font-display text-3xl text-chalk">You&rsquo;re offline.</h1>
      <p className="mt-2 text-steel-dim">So is the dabba. Reconnect and it still won&rsquo;t come.</p>
      <Link href="/" className="mt-8 rounded-xl bg-bandhani px-6 py-3 font-medium text-chalk">
        Try again
      </Link>
    </main>
  );
}
