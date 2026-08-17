/** ₹ with Indian digit grouping. Always paired with the .tnum mono class in UI. */
export function rupee(n: number): string {
  return "₹" + Math.round(n).toLocaleString("en-IN");
}

/** Plain grouped number, no symbol. */
export function inr(n: number): string {
  return Math.round(n).toLocaleString("en-IN");
}

export function pct(a: number, b: number): number {
  if (b <= 0) return 0;
  return Math.round((1 - a / b) * 100);
}
