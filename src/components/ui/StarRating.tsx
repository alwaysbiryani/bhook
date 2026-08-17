export function StarRating({
  rating,
  count,
  className = "",
}: {
  rating: number;
  count?: string;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-md bg-veg/15 px-1.5 py-0.5 text-veg ${className}`}
    >
      <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
        <path d="M12 2l2.9 6.3 6.9.7-5.1 4.6 1.4 6.8L12 17.8 5.9 20.4l1.4-6.8L2.2 9l6.9-.7z" />
      </svg>
      <span className="tnum text-xs font-semibold">{rating.toFixed(1)}</span>
      {count && <span className="text-[11px] text-veg/70">({count})</span>}
    </span>
  );
}
