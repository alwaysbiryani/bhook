"use client";

import { useEffect, useRef, useState } from "react";

/** A real finger-scratch card on <canvas>. Reveals `children` under a turmeric
 *  foil; calls onReveal once ~55% is scratched (or on the reduced-motion tap). */
export function ScratchCard({
  children,
  onReveal,
  className = "",
}: {
  children: React.ReactNode;
  onReveal?: () => void;
  className?: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const [revealed, setRevealed] = useState(false);
  const drawing = useRef(false);
  const done = useRef(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return;
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    const rect = wrap.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    const ctx = canvas.getContext("2d")!;
    ctx.scale(dpr, dpr);

    // foil
    const g = ctx.createLinearGradient(0, 0, rect.width, rect.height);
    g.addColorStop(0, "#f5b301");
    g.addColorStop(0.5, "#e0a000");
    g.addColorStop(1, "#f7c93b");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, rect.width, rect.height);
    ctx.fillStyle = "rgba(12,21,18,0.55)";
    ctx.font = "600 15px var(--font-body), system-ui";
    ctx.textAlign = "center";
    ctx.fillText("Scratch to reveal your reward", rect.width / 2, rect.height / 2 - 6);
    ctx.font = "13px var(--font-body), system-ui";
    ctx.fillText("(use your finger, like a lottery ticket)", rect.width / 2, rect.height / 2 + 16);

    const scratch = (x: number, y: number) => {
      ctx.globalCompositeOperation = "destination-out";
      ctx.beginPath();
      ctx.arc(x, y, 22, 0, Math.PI * 2);
      ctx.fill();
    };

    const measure = () => {
      const { data } = ctx.getImageData(0, 0, canvas.width, canvas.height);
      let clear = 0;
      for (let i = 3; i < data.length; i += 40) if (data[i] === 0) clear++;
      const frac = clear / (data.length / 40);
      if (frac > 0.45 && !done.current) {
        done.current = true;
        ctx.clearRect(0, 0, rect.width, rect.height);
        setRevealed(true);
        onReveal?.();
      }
    };

    const pos = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      return { x: e.clientX - r.left, y: e.clientY - r.top };
    };
    const down = (e: PointerEvent) => {
      drawing.current = true;
      canvas.setPointerCapture(e.pointerId);
      const { x, y } = pos(e);
      scratch(x, y);
    };
    const move = (e: PointerEvent) => {
      if (!drawing.current) return;
      const { x, y } = pos(e);
      scratch(x, y);
    };
    const up = () => {
      drawing.current = false;
      measure();
    };

    canvas.addEventListener("pointerdown", down);
    canvas.addEventListener("pointermove", move);
    canvas.addEventListener("pointerup", up);
    canvas.addEventListener("pointerleave", up);
    return () => {
      canvas.removeEventListener("pointerdown", down);
      canvas.removeEventListener("pointermove", move);
      canvas.removeEventListener("pointerup", up);
      canvas.removeEventListener("pointerleave", up);
    };
  }, [onReveal]);

  const revealNow = () => {
    if (done.current) return;
    done.current = true;
    const canvas = canvasRef.current;
    if (canvas) canvas.getContext("2d")?.clearRect(0, 0, canvas.width, canvas.height);
    setRevealed(true);
    onReveal?.();
  };

  return (
    <div ref={wrapRef} className={`relative overflow-hidden rounded-2xl ${className}`}>
      <div className="grid place-items-center p-6 text-center">{children}</div>
      <canvas
        ref={canvasRef}
        className={`absolute inset-0 h-full w-full touch-none transition-opacity ${revealed ? "pointer-events-none opacity-0" : "cursor-pointer"}`}
        aria-hidden={revealed}
      />
      {!revealed && (
        <button
          type="button"
          onClick={revealNow}
          className="absolute bottom-2 right-3 text-[11px] font-medium text-ink/60 underline"
        >
          reveal
        </button>
      )}
    </div>
  );
}
