"use client";

import { useEffect, useMemo, useState } from "react";
import { PauseIcon, PlayIcon, ResetIcon } from "../Icons";

/**
 * Simulated OptiWare flow. Everything is generated client-side from a seeded PRNG;
 * no model, camera, or network call is involved. State is a pure function of time `t`.
 */

type Cls = "small_parcel" | "large_parcel" | "damaged";
type Item = { id: number; cls: Cls; conf: number; spawn: number };

const SPEED = 95; // px per simulated second
const BELT_START = 20;
const CAM_X = 300; // detection point
const DIVERT_X = 440;
const BIN_X = 600;
const BELT_Y = 150;
const BINS: Record<Cls, { y: number; label: string; key: string }> = {
  small_parcel: { y: 60, label: "Bin A · small", key: "A" },
  large_parcel: { y: 150, label: "Bin B · large", key: "B" },
  damaged: { y: 240, label: "Reject · damaged", key: "R" },
};
const SIZE: Record<Cls, [number, number]> = { small_parcel: [22, 16], large_parcel: [34, 24], damaged: [26, 20] };

const T_DETECT = (CAM_X - BELT_START) / SPEED;
const T_DIVERT = (DIVERT_X - BELT_START) / SPEED;
const legTime = (cls: Cls) => Math.hypot(BIN_X - DIVERT_X, BINS[cls].y - BELT_Y) / SPEED;

function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function schedule(): Item[] {
  const rnd = mulberry32(42);
  const out: Item[] = [];
  let t = 0;
  for (let i = 0; i < 400; i++) {
    const r = rnd();
    const cls: Cls = r < 0.45 ? "small_parcel" : r < 0.87 ? "large_parcel" : "damaged";
    out.push({ id: i + 1, cls, conf: 0.86 + rnd() * 0.13, spawn: t });
    t += 1.2 + rnd() * 0.8;
  }
  return out;
}

function position(it: Item, t: number): [number, number] | null {
  const age = t - it.spawn;
  if (age < 0) return null;
  const x = BELT_START + age * SPEED;
  if (x <= DIVERT_X) return [x, BELT_Y];
  const f = (age - T_DIVERT) / legTime(it.cls);
  if (f >= 1) return null;
  return [DIVERT_X + (BIN_X - DIVERT_X) * f, BELT_Y + (BINS[it.cls].y - BELT_Y) * f];
}

const BASE = schedule();

const NODES = [
  { id: "cam", label: "IMX-500 camera" },
  { id: "pi", label: "Raspberry Pi · TFLite" },
  { id: "div", label: "Diverter" },
  { id: "sns", label: "AWS SNS" },
  { id: "lambda", label: "Lambda" },
  { id: "dash", label: "Dashboard · PostgreSQL" },
] as const;

export default function EdgeSortDemo() {
  const [injected, setInjected] = useState<Item[]>([]);
  const [t, setT] = useState(0);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (reduce) setT(14);
    else setPlaying(true);
  }, []);

  useEffect(() => {
    if (!playing) return;
    let last: number | null = null;
    let raf = 0;
    const tick = (now: number) => {
      if (last != null) {
        // Compute dt now: the updater runs later, after `last` is reassigned.
        const dt = Math.min(0.1, (now - last) / 1000);
        setT((x) => x + dt);
      }
      last = now;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    const onVis = () => document.hidden && setPlaying(false);
    document.addEventListener("visibilitychange", onVis);
    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, [playing]);

  const items = useMemo(() => [...BASE, ...injected].sort((a, b) => a.spawn - b.spawn), [injected]);

  const visible = items.filter((it) => it.spawn <= t && t - it.spawn < T_DIVERT + legTime(it.cls));
  const sorted = items.filter((it) => t - it.spawn >= T_DIVERT + legTime(it.cls));
  const counts = { A: 0, B: 0, R: 0 } as Record<string, number>;
  sorted.forEach((it) => counts[BINS[it.cls].key]++);
  const alerts = items.filter((it) => it.cls === "damaged" && t - it.spawn >= T_DIVERT + 0.6).length;

  // Event log (most recent first)
  const events: { at: number; text: string; tone: "ok" | "danger" | "muted" }[] = [];
  for (const it of items) {
    const d = it.spawn + T_DETECT;
    if (d > t || t - d > 12) continue;
    events.push({ at: d, text: `#${String(it.id).padStart(3, "0")} detected ${it.cls} (${it.conf.toFixed(2)})`, tone: "muted" });
    const v = it.spawn + T_DIVERT;
    if (v <= t) events.push({ at: v, text: `#${String(it.id).padStart(3, "0")} routed to ${BINS[it.cls].label.split(" · ")[0]}`, tone: "ok" });
    if (it.cls === "damaged" && v + 0.6 <= t) events.push({ at: v + 0.6, text: `#${String(it.id).padStart(3, "0")} alert published to operator dashboard`, tone: "danger" });
  }
  events.sort((a, b) => b.at - a.at);

  // Pipeline node activity
  const active = new Set<string>();
  const flash = (at: number, dur = 0.45) => t >= at && t < at + dur;
  for (const it of items) {
    if (flash(it.spawn + T_DETECT)) active.add("cam").add("pi");
    if (flash(it.spawn + T_DIVERT)) active.add("div");
    if (it.cls === "damaged") {
      if (flash(it.spawn + T_DIVERT + 0.15)) active.add("sns");
      if (flash(it.spawn + T_DIVERT + 0.35)) active.add("lambda");
      if (flash(it.spawn + T_DIVERT + 0.6, 0.8)) active.add("dash");
    }
  }

  const inject = () => {
    const id = 900 + injected.length + 1;
    setInjected((xs) => [...xs, { id, cls: "damaged", conf: 0.93, spawn: t }]);
    if (!playing) setPlaying(true);
  };

  const reset = () => {
    setInjected([]);
    setT(0);
  };

  return (
    <div className="rounded-xl border border-border bg-bg-elev">
      <div className="flex flex-wrap items-center gap-3 border-b border-border p-3 sm:p-4">
        <button
          type="button"
          onClick={() => setPlaying((p) => !p)}
          className="inline-flex h-9 items-center gap-2 rounded-md bg-accent-solid px-3 text-sm font-medium text-accent-solid-fg hover:brightness-110"
          aria-label={playing ? "Pause simulation" : "Play simulation"}
        >
          {playing ? <PauseIcon /> : <PlayIcon />}
          {playing ? "Pause" : "Play"}
        </button>
        <button type="button" onClick={reset} className="grid h-9 w-9 place-items-center rounded-md border border-border text-fg-muted hover:text-fg" aria-label="Reset simulation">
          <ResetIcon />
        </button>
        <button type="button" onClick={inject} className="inline-flex h-9 items-center rounded-md border border-danger/50 px-3 text-sm text-danger hover:bg-danger/10">
          Drop a damaged item
        </button>
        <dl className="ml-auto flex gap-4 font-mono text-xs">
          {[
            ["Bin A", counts.A],
            ["Bin B", counts.B],
            ["Reject", counts.R],
            ["Alerts", alerts],
          ].map(([k, v]) => (
            <div key={k as string} className="text-center">
              <dt className="text-[10px] uppercase text-fg-subtle">{k}</dt>
              <dd className="tabular-nums text-fg">{v}</dd>
            </div>
          ))}
        </dl>
      </div>

      <div className="grid lg:grid-cols-[1.6fr_1fr]">
        <div className="border-b border-border p-2 sm:p-4 lg:border-b-0 lg:border-r">
          <svg viewBox="0 0 720 300" className="h-auto w-full" role="img" aria-label={`Simulated conveyor. ${counts.A} small, ${counts.B} large and ${counts.R} damaged items sorted, ${alerts} alerts raised.`}>
            <rect width="720" height="300" fill="var(--sea)" rx="8" />
            {/* belt */}
            <rect x={BELT_START - 8} y={BELT_Y - 22} width={DIVERT_X - BELT_START + 16} height={44} rx={6} fill="var(--land)" stroke="var(--land-stroke)" />
            {Array.from({ length: 22 }, (_, i) => {
              const x = BELT_START + ((i * 20 + t * SPEED) % (DIVERT_X - BELT_START));
              return <line key={i} x1={x} x2={x} y1={BELT_Y - 20} y2={BELT_Y + 20} stroke="var(--land-stroke)" strokeWidth={1} />;
            })}
            {/* chutes */}
            {(Object.keys(BINS) as Cls[]).map((c) => (
              <g key={c}>
                <line x1={DIVERT_X} y1={BELT_Y} x2={BIN_X} y2={BINS[c].y} stroke="var(--land-stroke)" strokeWidth={14} strokeLinecap="round" />
                <rect x={BIN_X} y={BINS[c].y - 26} width={100} height={52} rx={6} fill="var(--bg)" stroke={c === "damaged" ? "var(--danger)" : "var(--border-strong)"} strokeWidth={1.5} />
                <text x={BIN_X + 50} y={BINS[c].y - 4} textAnchor="middle" fontSize={12} fill="var(--fg-muted)" fontFamily="var(--font-mono)">
                  {BINS[c].label.split(" · ")[0]}
                </text>
                <text x={BIN_X + 50} y={BINS[c].y + 14} textAnchor="middle" fontSize={11} fill="var(--fg-subtle)" fontFamily="var(--font-mono)">
                  {BINS[c].label.split(" · ")[1]}
                </text>
              </g>
            ))}
            {/* camera */}
            <rect x={CAM_X - 40} y={BELT_Y - 34} width={80} height={68} rx={4} fill="none" stroke="var(--accent)" strokeDasharray="4 4" opacity={0.7} />
            <rect x={CAM_X - 18} y={BELT_Y - 72} width={36} height={22} rx={4} fill={active.has("cam") ? "var(--accent-solid)" : "var(--border-strong)"} />
            <line x1={CAM_X} y1={BELT_Y - 50} x2={CAM_X} y2={BELT_Y - 34} stroke="var(--accent)" strokeDasharray="2 3" />
            <text x={CAM_X} y={BELT_Y - 80} textAnchor="middle" fontSize={11} fill="var(--fg-subtle)" fontFamily="var(--font-mono)">
              IMX-500
            </text>
            {/* diverter */}
            <circle cx={DIVERT_X} cy={BELT_Y} r={9} fill={active.has("div") ? "var(--accent-solid)" : "var(--border-strong)"} />
            {/* items */}
            {visible.map((it) => {
              const p = position(it, t);
              if (!p) return null;
              const [w, h] = SIZE[it.cls];
              const age = t - it.spawn;
              const detected = age >= T_DETECT;
              const showBox = detected && age < T_DIVERT;
              const color = it.cls === "damaged" ? "var(--danger)" : it.cls === "large_parcel" ? "var(--accent)" : "var(--ok)";
              return (
                <g key={it.id} transform={`translate(${p[0]},${p[1]})`}>
                  <rect x={-w / 2} y={-h / 2} width={w} height={h} rx={3} fill="var(--fg-subtle)" opacity={0.85} stroke={it.cls === "damaged" ? "var(--danger)" : "none"} strokeDasharray={it.cls === "damaged" ? "3 2" : undefined} strokeWidth={2} />
                  {showBox && (
                    <>
                      <rect x={-w / 2 - 4} y={-h / 2 - 4} width={w + 8} height={h + 8} fill="none" stroke={color} strokeWidth={1.8} />
                      <text x={-w / 2 - 4} y={-h / 2 - 8} fontSize={11} fill={color} fontFamily="var(--font-mono)">
                        {it.cls} {it.conf.toFixed(2)}
                      </text>
                    </>
                  )}
                </g>
              );
            })}
          </svg>

          {/* pipeline */}
          <ol className="mt-3 flex flex-wrap items-center gap-1.5 px-1 font-mono text-[11px]" aria-label="Event pipeline">
            {NODES.map((n, i) => (
              <li key={n.id} className="flex items-center gap-1.5">
                <span
                  className={`rounded-md border px-2 py-1 transition-colors duration-150 ${
                    active.has(n.id)
                      ? n.id === "sns" || n.id === "lambda" || n.id === "dash"
                        ? "border-danger bg-danger/10 text-fg"
                        : "border-accent bg-accent-soft text-fg"
                      : "border-border text-fg-subtle"
                  }`}
                >
                  {n.label}
                </span>
                {i < NODES.length - 1 && (
                  <span className="text-fg-subtle" aria-hidden>
                    {i === 2 ? "⇢" : "→"}
                  </span>
                )}
              </li>
            ))}
          </ol>
          <p className="mt-2 px-1 text-[11px] text-fg-subtle">Edge path: camera → on-device inference → diverter. Cloud path (damaged items only): SNS → Lambda → dashboard.</p>
        </div>

        <div className="p-4">
          <h4 className="font-mono text-[11px] uppercase tracking-wider text-fg-subtle">Event log</h4>
          <ol className="mt-2 space-y-1 font-mono text-[11px]" aria-live="off">
            {events.slice(0, 12).map((e, i) => (
              <li key={`${e.at}-${i}`} className={`flex gap-2 ${i === 0 ? "" : "opacity-80"}`}>
                <span className="tabular-nums text-fg-subtle">{e.at.toFixed(1).padStart(5, " ")}s</span>
                <span className={e.tone === "danger" ? "text-danger" : e.tone === "ok" ? "text-ok" : "text-fg-muted"}>{e.text}</span>
              </li>
            ))}
            {events.length === 0 && <li className="text-fg-subtle">Waiting for the first item…</li>}
          </ol>
        </div>
      </div>
    </div>
  );
}
