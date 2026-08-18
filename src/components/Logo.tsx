import { BRAND } from "@/lib/brand";

/** The mark: a stacked stainless-steel tiffin — a "dabba" — which is exactly the
 *  thing this app never delivers. Steel body, bandhani clasps, a turmeric knob,
 *  and (optionally) motion dashes so it looks like it's speeding off to never arrive. */
export function LogoMark({
  className = "",
  motion = false,
}: {
  className?: string;
  motion?: boolean;
}) {
  return (
    <svg viewBox="0 0 44 44" className={className} role="img" aria-label={`${BRAND.name} logo`}>
      <defs>
        <linearGradient id="lm-steel" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#eef1ec" />
          <stop offset="52%" stopColor="#cfd4cb" />
          <stop offset="100%" stopColor="#a3a99f" />
        </linearGradient>
      </defs>

      {/* motion dashes trailing left — it's on its way (it isn't) */}
      {motion && (
        <g stroke="#f5b301" strokeWidth="2.4" strokeLinecap="round" opacity="0.9">
          <line x1="1" y1="20" x2="6" y2="20" />
          <line x1="2.5" y1="26" x2="8" y2="26" />
          <line x1="1.5" y1="32" x2="6.5" y2="32" />
        </g>
      )}

      {/* handle + knob */}
      <path d="M15 15 C15 7 29 7 29 15" fill="none" stroke="#b6bcb3" strokeWidth="2.6" strokeLinecap="round" />
      <circle cx="22" cy="8" r="2.2" fill="#f5b301" />

      {/* top tier */}
      <rect x="13" y="14.5" width="18" height="10.5" rx="2.4" fill="url(#lm-steel)" />
      <rect x="15" y="16.4" width="6.5" height="2" rx="1" fill="#ffffff" opacity="0.55" />
      {/* bottom tier (a touch wider) */}
      <rect x="12" y="25.5" width="20" height="12" rx="2.6" fill="url(#lm-steel)" />
      <rect x="14.5" y="27.6" width="7" height="2" rx="1" fill="#ffffff" opacity="0.5" />

      {/* clasps */}
      <rect x="9.6" y="24" width="3.2" height="6" rx="1.4" fill="#d6336c" />
      <rect x="31.2" y="24" width="3.2" height="6" rx="1.4" fill="#d6336c" />
    </svg>
  );
}

/** Mark + wordmark. `full` shows the whole name; otherwise the short name. */
export function Logo({
  className = "",
  full = false,
}: {
  className?: string;
  full?: boolean;
}) {
  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <LogoMark className="h-7 w-7 shrink-0" />
      <span className="font-display leading-none text-chalk">{full ? BRAND.name : BRAND.short}</span>
    </span>
  );
}
