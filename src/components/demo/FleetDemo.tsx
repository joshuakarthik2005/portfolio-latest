"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  HORIZON,
  LAND_PATHS,
  PORTS,
  TIMELINE,
  TOTAL_COST_CR,
  TOTAL_DEMAND,
  VESSELS,
  VIEW,
  along,
  project,
  type Phase,
  type Trip,
} from "@/data/fleet-demo";
import { PauseIcon, PlayIcon, ResetIcon } from "../Icons";

const DAYS_PER_SECOND = 0.8;
const SPEEDS = [0.5, 1, 2, 4];

const phaseStyle: Record<Phase, { cls: string; label: string }> = {
  load: { cls: "bg-accent-solid", label: "Loading" },
  sail: { cls: "bg-accent/60", label: "Sailing" },
  discharge: { cls: "bg-ok", label: "Discharging" },
  return: { cls: "bg-border-strong", label: "Return leg" },
};

const fmt = (n: number) => n.toLocaleString("en-IN");

function vesselState(vesselId: string, t: number) {
  const trips = TIMELINE.filter((x) => x.vessel === vesselId);
  const active = trips.find((x) => t >= x.start && t < x.end);
  if (active) {
    const seg = active.segments.find((s) => t >= s.start && t < s.end) ?? active.segments[active.segments.length - 1];
    const f = (t - seg.start) / Math.max(seg.end - seg.start, 1e-6);
    return { pos: along(seg.path, f), trip: active, phase: seg.phase as Phase | null };
  }
  const past = trips.filter((x) => x.end <= t).pop();
  const ref = past ?? trips[0];
  const p = PORTS.find((pp) => pp.id === ref.from)!;
  return { pos: project(p.lat, p.lon), trip: null as Trip | null, phase: null as Phase | null };
}

function delivered(t: number) {
  const out: Record<string, number> = {};
  for (const trip of TIMELINE) {
    for (const s of trip.segments) {
      if (s.phase !== "discharge" || !s.port || !s.volume) continue;
      const f = Math.max(0, Math.min(1, (t - s.start) / (s.end - s.start)));
      out[s.port] = (out[s.port] ?? 0) + s.volume * f;
    }
  }
  return out;
}

export default function FleetDemo() {
  const [t, setT] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [selected, setSelected] = useState<string | null>(null);
  const raf = useRef<number | null>(null);

  // Autoplay only when the user hasn't asked for reduced motion.
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (!reduce) setPlaying(true);
    else setT(HORIZON * 0.45);
  }, []);

  useEffect(() => {
    if (!playing) return;
    let last: number | null = null;
    const tick = (now: number) => {
      if (last != null) {
        const dt = (now - last) / 1000;
        setT((prev) => {
          const next = prev + dt * DAYS_PER_SECOND * speed;
          if (next >= HORIZON) {
            setPlaying(false);
            return HORIZON;
          }
          return next;
        });
      }
      last = now;
      raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => {
      if (raf.current) cancelAnimationFrame(raf.current);
    };
  }, [playing, speed]);

  // Pause when the tab is hidden.
  useEffect(() => {
    const onVis = () => document.hidden && setPlaying(false);
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, []);

  const states = useMemo(() => VESSELS.map((v) => ({ v, ...vesselState(v.id, t) })), [t]);
  const del = useMemo(() => delivered(t), [t]);
  const totalDelivered = Object.values(del).reduce((a, b) => a + b, 0);
  const tripsDone = TIMELINE.filter((x) => x.end <= t).length;
  const atSea = states.filter((s) => s.trip).length;
  const costSoFar = TIMELINE.reduce((s, x) => {
    const rate = VESSELS.find((v) => v.id === x.vessel)!.rateCrPerDay;
    return s + rate * Math.max(0, Math.min(t, x.end) - x.start);
  }, 0);

  const togglePlay = () => {
    if (!playing && t >= HORIZON) setT(0);
    setPlaying((p) => !p);
  };

  const shownTrips = states
    .filter((s) => s.trip && (!selected || s.v.id === selected))
    .map((s) => s.trip!) as Trip[];
  const selectedTrips = selected ? TIMELINE.filter((x) => x.vessel === selected) : [];

  return (
    <div className="rounded-xl border border-border bg-bg-elev">
      {/* Controls */}
      <div className="flex flex-wrap items-center gap-3 border-b border-border p-3 sm:p-4">
        <button
          type="button"
          onClick={togglePlay}
          className="inline-flex h-9 items-center gap-2 rounded-md bg-accent-solid px-3 text-sm font-medium text-accent-solid-fg hover:brightness-110"
          aria-label={playing ? "Pause playback" : "Play playback"}
        >
          {playing ? <PauseIcon /> : <PlayIcon />}
          {playing ? "Pause" : "Play"}
        </button>
        <button
          type="button"
          onClick={() => {
            setPlaying(false);
            setT(0);
          }}
          className="grid h-9 w-9 place-items-center rounded-md border border-border text-fg-muted hover:text-fg"
          aria-label="Reset to day 0"
        >
          <ResetIcon />
        </button>
        <label className="flex items-center gap-2 text-xs text-fg-muted">
          <span className="sr-only sm:not-sr-only">Speed</span>
          <select
            value={speed}
            onChange={(e) => setSpeed(Number(e.target.value))}
            className="h-9 rounded-md border border-border bg-bg px-2 font-mono text-xs text-fg"
            aria-label="Playback speed"
          >
            {SPEEDS.map((s) => (
              <option key={s} value={s}>
                {s}×
              </option>
            ))}
          </select>
        </label>
        <label className="flex min-w-[180px] flex-1 items-center gap-3">
          <span className="sr-only">Timeline position in days</span>
          <input
            type="range"
            min={0}
            max={HORIZON}
            step={0.05}
            value={t}
            onChange={(e) => {
              setPlaying(false);
              setT(Number(e.target.value));
            }}
            className="w-full accent-[var(--accent)]"
            aria-valuetext={`Day ${t.toFixed(1)} of ${HORIZON}`}
          />
        </label>
        <output className="w-[92px] text-right font-mono text-xs tabular-nums text-fg" aria-live="off">
          day {t.toFixed(1).padStart(4, " ")}/{HORIZON}
        </output>
      </div>

      <div className="grid lg:grid-cols-[1.35fr_1fr]">
        {/* Map */}
        <div className="border-b border-border p-2 sm:p-4 lg:border-b-0 lg:border-r">
          <svg
            viewBox={`40 20 ${VIEW.w - 40} ${VIEW.h - 30}`}
            className="h-auto w-full"
            role="img"
            aria-label={`Schematic map of India's coast showing 6 loading ports, 11 unloading ports and 9 tankers at day ${t.toFixed(1)}. ${atSea} vessels on active trips.`}
          >
            <rect x="0" y="0" width={VIEW.w} height={VIEW.h} fill="var(--sea)" />
            {LAND_PATHS.map((d, i) => (
              <path key={i} d={d} fill="var(--land)" stroke="var(--land-stroke)" strokeWidth={1.5} />
            ))}
            {/* Active routes */}
            {(selected ? selectedTrips : shownTrips).map((trip) => (
              <g key={trip.id} opacity={selected && !(t >= trip.start && t < trip.end) ? 0.35 : 1}>
                {trip.segments
                  .filter((s) => s.phase === "sail" || s.phase === "return")
                  .map((s, i) => (
                    <polyline
                      key={i}
                      points={s.path.map((p) => p.join(",")).join(" ")}
                      fill="none"
                      stroke={s.phase === "sail" ? "var(--accent)" : "var(--fg-subtle)"}
                      strokeWidth={selected ? 2.2 : 1.4}
                      strokeDasharray={s.phase === "return" ? "4 5" : "6 4"}
                      opacity={0.75}
                    />
                  ))}
              </g>
            ))}
            {/* Ports */}
            {PORTS.map((p) => {
              const [x, y] = project(p.lat, p.lon);
              if (p.kind === "load") {
                return (
                  <g key={p.id}>
                    <rect x={x - 6} y={y - 6} width={12} height={12} rx={2} fill="var(--accent-solid)" stroke="var(--bg)" strokeWidth={1.5} />
                    <text x={x + 10} y={y + 4} fontSize={13} fill="var(--fg-muted)" fontFamily="var(--font-mono)">
                      {p.id}
                    </text>
                  </g>
                );
              }
              const frac = Math.min(1, (del[p.id] ?? 0) / (p.demand ?? 1));
              const r = 4 + Math.sqrt((p.demand ?? 0) / 5000) * 1.6;
              return (
                <g key={p.id}>
                  <circle cx={x} cy={y} r={r} fill="var(--bg)" stroke="var(--ok)" strokeWidth={1.5} />
                  <circle cx={x} cy={y} r={r * Math.sqrt(frac)} fill="var(--ok)" opacity={0.85} />
                </g>
              );
            })}
            {/* Vessels */}
            {states.map(({ v, pos, trip }) => {
              const isSel = selected === v.id;
              const dim = selected && !isSel;
              return (
                <g
                  key={v.id}
                  transform={`translate(${pos[0]},${pos[1]})`}
                  opacity={dim ? 0.25 : trip ? 1 : 0.7}
                  style={{ cursor: "pointer" }}
                  onClick={() => setSelected(isSel ? null : v.id)}
                >
                  <circle r={isSel ? 8 : trip ? 6 : 3} fill={trip ? "var(--fg)" : "var(--fg-subtle)"} stroke="var(--accent)" strokeWidth={isSel ? 3 : trip ? 1.5 : 0} />
                  {(trip || isSel) && (
                    <text x={9} y={-8} fontSize={13} fontWeight={600} fill="var(--fg)" fontFamily="var(--font-mono)">
                      {v.id}
                    </text>
                  )}
                </g>
              );
            })}
          </svg>
          <ul className="mt-2 flex flex-wrap gap-x-4 gap-y-1 px-2 text-[11px] text-fg-subtle">
            <li className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-[2px] bg-accent-solid" aria-hidden /> Loading port (L1–L6)
            </li>
            <li className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full border border-ok" aria-hidden /> Unloading port, fill = demand met
            </li>
            <li className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-fg" aria-hidden /> Tanker
            </li>
          </ul>
        </div>

        {/* Stats */}
        <div className="space-y-5 p-4 sm:p-5">
          <dl className="grid grid-cols-2 gap-3">
            {[
              { k: "Delivered", v: `${fmt(Math.round(totalDelivered / 1000))}k / ${fmt(TOTAL_DEMAND / 1000)}k MT` },
              { k: "Trips complete", v: `${tripsDone} / ${TIMELINE.length}` },
              { k: "Vessels on trips", v: `${atSea} / ${VESSELS.length}` },
              { k: "Charter cost", v: `₹${costSoFar.toFixed(2)} / ${TOTAL_COST_CR.toFixed(2)} Cr` },
            ].map((s) => (
              <div key={s.k} className="rounded-lg border border-border bg-bg p-3">
                <dt className="text-[11px] uppercase tracking-wider text-fg-subtle">{s.k}</dt>
                <dd className="mt-1 font-mono text-sm tabular-nums text-fg">{s.v}</dd>
              </div>
            ))}
          </dl>
          <div>
            <h4 className="mb-2 font-mono text-[11px] uppercase tracking-wider text-fg-subtle">Demand satisfaction by port</h4>
            <ul className="space-y-1.5">
              {PORTS.filter((p) => p.kind === "unload").map((p) => {
                const frac = Math.min(1, (del[p.id] ?? 0) / (p.demand ?? 1));
                return (
                  <li key={p.id} className="grid grid-cols-[2.5rem_1fr_6.5rem] items-center gap-2 font-mono text-[11px]">
                    <span className="text-fg-muted">{p.id}</span>
                    <span className="h-1.5 overflow-hidden rounded-full bg-bg-sunken" aria-hidden>
                      <span className="block h-full rounded-full bg-ok" style={{ width: `${frac * 100}%` }} />
                    </span>
                    <span className="text-right tabular-nums text-fg-subtle">
                      {Math.round(frac * 100)}% · {p.demand! / 1000}k
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>

      {/* Gantt */}
      <div className="border-t border-border p-3 sm:p-5">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <h4 className="font-mono text-[11px] uppercase tracking-wider text-fg-subtle">Fleet schedule (Gantt)</h4>
          <ul className="flex flex-wrap gap-x-3 gap-y-1 text-[11px] text-fg-subtle">
            {(Object.keys(phaseStyle) as Phase[]).map((ph) => (
              <li key={ph} className="flex items-center gap-1.5">
                <span className={`h-2 w-3 rounded-sm ${phaseStyle[ph].cls}`} aria-hidden />
                {phaseStyle[ph].label}
              </li>
            ))}
          </ul>
        </div>
        <div className="relative" aria-hidden>
          <div className="space-y-1">
            {VESSELS.map((v) => {
              const isSel = selected === v.id;
              return (
                <button
                  key={v.id}
                  type="button"
                  tabIndex={-1}
                  onClick={() => setSelected(isSel ? null : v.id)}
                  className={`grid w-full grid-cols-[3.25rem_1fr] items-center gap-2 rounded text-left ${
                    selected && !isSel ? "opacity-40" : ""
                  }`}
                >
                  <span className={`font-mono text-[11px] ${isSel ? "text-accent" : "text-fg-muted"}`}>
                    {v.id}
                    <span className="text-fg-subtle"> {v.capacity / 1000}k</span>
                  </span>
                  <span className="relative block h-5 rounded bg-bg-sunken">
                    {TIMELINE.filter((x) => x.vessel === v.id).flatMap((trip) =>
                      trip.segments.map((s, i) => (
                        <span
                          key={`${trip.id}-${i}`}
                          className={`absolute top-0.5 bottom-0.5 ${phaseStyle[s.phase].cls} ${i === 0 ? "rounded-l-sm" : ""} ${
                            i === trip.segments.length - 1 ? "rounded-r-sm" : ""
                          }`}
                          style={{ left: `${(s.start / HORIZON) * 100}%`, width: `${((s.end - s.start) / HORIZON) * 100}%` }}
                        />
                      )),
                    )}
                  </span>
                </button>
              );
            })}
          </div>
          <div className="pointer-events-none absolute inset-y-0 left-[calc(3.25rem+0.5rem)] right-0">
            <div className="absolute inset-y-0 w-px bg-fg" style={{ left: `${(t / HORIZON) * 100}%` }} />
          </div>
          <div className="mt-1 grid grid-cols-[3.25rem_1fr] gap-2">
            <span />
            <div className="relative h-4 font-mono text-[10px] text-fg-subtle">
              {Array.from({ length: HORIZON + 1 }, (_, d) => (
                <span key={d} className="absolute -translate-x-1/2" style={{ left: `${(d / HORIZON) * 100}%` }}>
                  {d}
                </span>
              ))}
            </div>
          </div>
        </div>
        <p className="mt-3 text-xs text-fg-subtle">
          Click a tanker on the map or a row in the schedule to isolate its trips.{" "}
          {selected && (
            <button type="button" onClick={() => setSelected(null)} className="text-accent underline">
              Show all vessels
            </button>
          )}
        </p>

        <details className="mt-4 text-sm">
          <summary className="cursor-pointer font-mono text-xs text-fg-muted hover:text-accent">View schedule as a table</summary>
          <div className="mt-3 overflow-x-auto">
            <table className="w-full min-w-[560px] border-collapse text-left font-mono text-xs">
              <caption className="sr-only">Illustrative trip schedule</caption>
              <thead className="text-fg-subtle">
                <tr className="border-b border-border">
                  <th scope="col" className="py-2 pr-3 font-normal">Trip</th>
                  <th scope="col" className="py-2 pr-3 font-normal">Load</th>
                  <th scope="col" className="py-2 pr-3 font-normal">Discharge</th>
                  <th scope="col" className="py-2 pr-3 font-normal">Volume (MT)</th>
                  <th scope="col" className="py-2 pr-3 font-normal">Days</th>
                  <th scope="col" className="py-2 font-normal">Charter (₹ Cr)</th>
                </tr>
              </thead>
              <tbody className="text-fg-muted">
                {TIMELINE.map((x) => (
                  <tr key={x.id} className="border-b border-border/60">
                    <td className="py-1.5 pr-3 text-fg">{x.vessel}</td>
                    <td className="py-1.5 pr-3">{x.from}</td>
                    <td className="py-1.5 pr-3">{x.drops.map((d) => `${d.port} (${fmt(d.volume)})`).join(", ")}</td>
                    <td className="py-1.5 pr-3 tabular-nums">{fmt(x.drops.reduce((s, d) => s + d.volume, 0))}</td>
                    <td className="py-1.5 pr-3 tabular-nums">
                      {x.start.toFixed(1)} to {x.end.toFixed(1)}
                    </td>
                    <td className="py-1.5 tabular-nums">{x.costCr.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </details>
      </div>
    </div>
  );
}
