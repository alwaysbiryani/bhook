"use client";

import { useEffect, useRef } from "react";
import { inr } from "@/lib/format";

/** A 9:16 shareable receipt drawn on <canvas> — "I saved ₹X today by ordering
 *  nothing." Offers a real download (works in a browser; inert only inside a
 *  sandboxed artifact). */
export function ShareCard({
  saved,
  restaurantName,
  itemTotal,
  lifetimeSaved,
  orderCount,
}: {
  saved: number;
  restaurantName: string;
  itemTotal: number;
  lifetimeSaved: number;
  orderCount: number;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const W = 1080, H = 1920;
    canvas.width = W;
    canvas.height = H;
    const ctx = canvas.getContext("2d")!;

    // bg
    const g = ctx.createLinearGradient(0, 0, 0, H);
    g.addColorStop(0, "#12241c");
    g.addColorStop(1, "#0c1512");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, W, H);

    const cx = W / 2;
    ctx.textAlign = "center";

    // brand
    ctx.fillStyle = "#dcdfda";
    ctx.font = "600 40px ui-sans-serif, system-ui, sans-serif";
    ctx.fillText("D A B B A   N E V E R   C O M E S", cx, 180);

    // steel plate mark
    ctx.beginPath();
    ctx.arc(cx, 420, 130, 0, Math.PI * 2);
    ctx.fillStyle = "#c7ccc4";
    ctx.fill();
    ctx.beginPath();
    ctx.arc(cx, 420, 90, 0, Math.PI * 2);
    ctx.fillStyle = "#f4f6f2";
    ctx.fill();
    ctx.beginPath();
    ctx.arc(cx, 410, 34, 0, Math.PI * 2);
    ctx.fillStyle = "#d6336c";
    ctx.fill();

    // headline
    ctx.fillStyle = "#faf8f3";
    ctx.font = "500 56px ui-sans-serif, system-ui, sans-serif";
    ctx.fillText("I saved", cx, 720);

    ctx.fillStyle = "#f5b301";
    ctx.font = "700 220px ui-monospace, monospace";
    ctx.fillText("₹" + inr(saved), cx, 940);

    ctx.fillStyle = "#faf8f3";
    ctx.font = "500 56px ui-sans-serif, system-ui, sans-serif";
    ctx.fillText("today by ordering nothing.", cx, 1030);

    // receipt panel
    const px = 140, py = 1140, pw = W - 280, ph = 460;
    ctx.fillStyle = "rgba(220,223,218,0.06)";
    roundRect(ctx, px, py, pw, ph, 32);
    ctx.fill();

    ctx.textAlign = "left";
    ctx.font = "400 44px ui-sans-serif, system-ui, sans-serif";
    const rows: [string, string, string?][] = [
      ["From", restaurantName],
      ["Item total", "₹" + inr(itemTotal)],
      ["You paid", "₹0"],
      ["Delivered", "never"],
    ];
    let ry = py + 90;
    for (const [k, v, ] of rows) {
      ctx.fillStyle = "#9aa39c";
      ctx.fillText(k, px + 50, ry);
      ctx.textAlign = "right";
      ctx.fillStyle = v === "₹0" ? "#d6336c" : "#faf8f3";
      ctx.font = /₹|never/.test(v) ? "600 44px ui-monospace, monospace" : "500 44px ui-sans-serif, system-ui, sans-serif";
      ctx.fillText(v, px + pw - 50, ry);
      ctx.textAlign = "left";
      ctx.font = "400 44px ui-sans-serif, system-ui, sans-serif";
      ry += 100;
    }

    // lifetime
    ctx.textAlign = "center";
    ctx.fillStyle = "#f5b301";
    ctx.font = "600 46px ui-monospace, monospace";
    ctx.fillText("₹" + inr(lifetimeSaved) + " not spent · " + orderCount + " never delivered", cx, 1720);

    // footer
    ctx.fillStyle = "#9aa39c";
    ctx.font = "400 38px ui-sans-serif, system-ui, sans-serif";
    ctx.fillText("dabbanevercomes.app · a parody", cx, 1830);
  }, [saved, restaurantName, itemTotal, lifetimeSaved, orderCount]);

  const download = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.toBlob((blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "dabba-never-comes-receipt.png";
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    }, "image/png");
  };

  return (
    <div className="flex flex-col items-center">
      <canvas
        ref={canvasRef}
        className="w-full max-w-[260px] rounded-2xl border border-line/10 shadow-pop"
        aria-label="Shareable receipt"
      />
      <button
        onClick={download}
        className="mt-4 flex items-center gap-2 rounded-xl bg-bandhani px-6 py-3 font-semibold text-fg shadow-pop active:scale-95"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
          <path d="M12 3v12m0 0l-4-4m4 4l4-4M4 21h16" />
        </svg>
        Save receipt
      </button>
    </div>
  );
}

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}
