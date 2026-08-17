/**
 * Four synthesized cues, no audio files. Web Audio only, created lazily on the
 * first user gesture so nothing autoplays. Respects the store's mute flag via
 * setMuted(). Safe to import on the server (all calls no-op without window).
 */

type Cue = "pop" | "coupon" | "success" | "doorbell";

let ctx: AudioContext | null = null;
let muted = false;

function ac(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!ctx) {
    const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
  }
  if (ctx.state === "suspended") void ctx.resume();
  return ctx;
}

export function setMuted(m: boolean) {
  muted = m;
}

function tone(
  c: AudioContext,
  freq: number,
  start: number,
  dur: number,
  gain = 0.14,
  type: OscillatorType = "sine",
) {
  const osc = c.createOscillator();
  const g = c.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, c.currentTime + start);
  g.gain.setValueAtTime(0, c.currentTime + start);
  g.gain.linearRampToValueAtTime(gain, c.currentTime + start + 0.012);
  g.gain.exponentialRampToValueAtTime(0.0001, c.currentTime + start + dur);
  osc.connect(g).connect(c.destination);
  osc.start(c.currentTime + start);
  osc.stop(c.currentTime + start + dur + 0.02);
}

export function play(cue: Cue) {
  if (muted) return;
  const c = ac();
  if (!c) return;
  switch (cue) {
    case "pop":
      // a quick, satisfying blip that rises
      tone(c, 520, 0, 0.09, 0.12, "triangle");
      tone(c, 780, 0.04, 0.1, 0.1, "sine");
      break;
    case "coupon":
      tone(c, 660, 0, 0.08, 0.1, "square");
      tone(c, 880, 0.06, 0.09, 0.09, "square");
      tone(c, 1180, 0.13, 0.12, 0.08, "sine");
      break;
    case "success":
      // two-tone UPI-style success chime
      tone(c, 784, 0, 0.18, 0.16, "sine"); // G5
      tone(c, 1047, 0.16, 0.34, 0.16, "sine"); // C6
      break;
    case "doorbell":
      tone(c, 660, 0, 0.4, 0.16, "sine"); // ding
      tone(c, 523, 0.42, 0.6, 0.16, "sine"); // dong
      break;
  }
}

/** Prime the audio context from within a user gesture (call on first tap). */
export function primeAudio() {
  ac();
}
