/**
 * Static sample data for the fleet playback demo.
 *
 * Source of the inputs: CosmicEngineers/RouteX → backend/app/data/challenge_data.py
 * (Challenge 7.1 dataset): vessel capacities, charter rates, port coordinates,
 * port demands, and L→U / U→U trip times (days).
 *
 * The TRIPS list is a hand-built illustrative plan, NOT RouteX solver output.
 * Load/discharge durations assume 1,500 MT/hour (the dataset's unloading_rate),
 * applied to loading as well, purely for illustration.
 */

export type Port = { id: string; lat: number; lon: number; kind: "load" | "unload"; demand?: number; coast: "west" | "east" };
export type Vessel = { id: string; capacity: number; rateCrPerDay: number };
export type Drop = { port: string; volume: number };
export type TripPlan = { vessel: string; from: string; drops: Drop[]; start: number };

export const PORTS: Port[] = [
  { id: "L1", lat: 19.0, lon: 72.8, kind: "load", coast: "west" },
  { id: "L2", lat: 21.0, lon: 72.0, kind: "load", coast: "west" },
  { id: "L3", lat: 20.5, lon: 71.5, kind: "load", coast: "west" },
  { id: "L4", lat: 13.1, lon: 80.3, kind: "load", coast: "east" },
  { id: "L5", lat: 17.7, lon: 83.3, kind: "load", coast: "east" },
  { id: "L6", lat: 22.5, lon: 88.3, kind: "load", coast: "east" },
  { id: "U1", lat: 18.5, lon: 73.0, kind: "unload", demand: 40000, coast: "west" },
  { id: "U2", lat: 15.5, lon: 73.8, kind: "unload", demand: 135000, coast: "west" },
  { id: "U3", lat: 19.5, lon: 72.5, kind: "unload", demand: 5000, coast: "west" },
  { id: "U4", lat: 18.0, lon: 73.5, kind: "unload", demand: 20000, coast: "west" },
  { id: "U5", lat: 17.5, lon: 73.0, kind: "unload", demand: 20000, coast: "west" },
  { id: "U6", lat: 16.0, lon: 74.0, kind: "unload", demand: 20000, coast: "west" },
  { id: "U7", lat: 10.0, lon: 76.3, kind: "unload", demand: 110000, coast: "west" },
  { id: "U8", lat: 19.0, lon: 72.5, kind: "unload", demand: 30000, coast: "west" },
  { id: "U9", lat: 18.2, lon: 73.2, kind: "unload", demand: 20000, coast: "west" },
  { id: "U10", lat: 18.8, lon: 72.9, kind: "unload", demand: 20000, coast: "west" },
  { id: "U11", lat: 15.0, lon: 74.5, kind: "unload", demand: 20000, coast: "west" },
];

export const VESSELS: Vessel[] = [
  { id: "T1", capacity: 50000, rateCrPerDay: 0.63 },
  { id: "T2", capacity: 50000, rateCrPerDay: 0.49 },
  { id: "T3", capacity: 50000, rateCrPerDay: 0.51 },
  { id: "T4", capacity: 50000, rateCrPerDay: 0.51 },
  { id: "T5", capacity: 50000, rateCrPerDay: 0.53 },
  { id: "T6", capacity: 50000, rateCrPerDay: 0.57 },
  { id: "T7", capacity: 50000, rateCrPerDay: 0.65 },
  { id: "T8", capacity: 25000, rateCrPerDay: 0.39 },
  { id: "T9", capacity: 25000, rateCrPerDay: 0.38 },
];

const LU: Record<string, Record<string, number>> = {
  L1: { U1: 0.4, U2: 0.7, U3: 0.4, U4: 0.4, U5: 0.4, U6: 0.6, U7: 0.5, U8: 0.4, U9: 0.3, U10: 0.5, U11: 0.7 },
  L2: { U1: 0.4, U2: 0.6, U3: 0.5, U4: 0.4, U5: 0.4, U6: 0.5, U7: 0.5, U8: 0.5, U9: 0.3, U10: 0.5, U11: 0.6 },
  L3: { U1: 0.4, U2: 0.6, U3: 0.5, U4: 0.4, U5: 0.4, U6: 0.5, U7: 0.5, U8: 0.5, U9: 0.3, U10: 0.6, U11: 0.6 },
  L4: { U1: 0.4, U2: 0.6, U3: 0.4, U4: 0.3, U5: 0.3, U6: 0.5, U7: 0.5, U8: 0.4, U9: 0.3, U10: 0.5, U11: 0.6 },
  L5: { U1: 0.4, U2: 0.6, U3: 0.4, U4: 0.3, U5: 0.3, U6: 0.5, U7: 0.5, U8: 0.4, U9: 0.3, U10: 0.5, U11: 0.5 },
  L6: { U1: 0.58, U2: 0.73, U3: 0.64, U4: 0.56, U5: 0.56, U6: 0.65, U7: 0.67, U8: 0.64, U9: 0.5, U10: 0.7, U11: 0.73 },
};

const UU: Record<string, Record<string, number>> = {
  U1: { U10: 0.19 },
  U2: { U6: 0.15 },
  U4: {},
  U6: { U4: 0.31 },
  U7: { U11: 0.28 },
  U8: { U9: 0.09 },
  U5: { U10: 0.21 },
  U11: { U3: 0.34 },
};

/** Illustrative plan: every unloading port's demand is met exactly (440,000 MT). */
export const TRIPS: TripPlan[] = [
  { vessel: "T2", from: "L1", drops: [{ port: "U2", volume: 50000 }], start: 0 },
  { vessel: "T3", from: "L1", drops: [{ port: "U2", volume: 50000 }], start: 1.5 },
  { vessel: "T4", from: "L2", drops: [{ port: "U2", volume: 35000 }, { port: "U6", volume: 15000 }], start: 0.5 },
  { vessel: "T5", from: "L4", drops: [{ port: "U7", volume: 50000 }], start: 0 },
  { vessel: "T6", from: "L5", drops: [{ port: "U7", volume: 50000 }], start: 1 },
  { vessel: "T1", from: "L1", drops: [{ port: "U1", volume: 40000 }, { port: "U10", volume: 10000 }], start: 3 },
  { vessel: "T7", from: "L3", drops: [{ port: "U8", volume: 30000 }, { port: "U9", volume: 20000 }], start: 2 },
  { vessel: "T8", from: "L1", drops: [{ port: "U6", volume: 5000 }, { port: "U4", volume: 20000 }], start: 4.5 },
  { vessel: "T9", from: "L2", drops: [{ port: "U7", volume: 10000 }, { port: "U11", volume: 15000 }], start: 2.5 },
  { vessel: "T2", from: "L1", drops: [{ port: "U5", volume: 20000 }, { port: "U10", volume: 10000 }], start: 6 },
  { vessel: "T9", from: "L1", drops: [{ port: "U11", volume: 5000 }, { port: "U3", volume: 5000 }], start: 7 },
];

// ---------------------------------------------------------------------------
// Derived timeline
// ---------------------------------------------------------------------------

const MT_PER_DAY = 1500 * 24;

export type Phase = "load" | "sail" | "discharge" | "return";
export type Segment = {
  phase: Phase;
  start: number;
  end: number;
  /** Polyline in projected SVG coords the vessel traverses during this segment (single point when stationary). */
  path: [number, number][];
  port?: string;
  volume?: number;
};
export type Trip = TripPlan & { id: string; end: number; days: number; costCr: number; segments: Segment[] };

// Projection (equirectangular, schematic)
export const VIEW = { lonMin: 66, latMax: 25, k: 30, w: 720, h: 660 };
export function project(lat: number, lon: number): [number, number] {
  return [+((lon - VIEW.lonMin) * VIEW.k).toFixed(1), +((VIEW.latMax - lat) * VIEW.k * 1.05).toFixed(1)];
}

const portById = Object.fromEntries(PORTS.map((p) => [p.id, p]));

/** Sea-lane approximation: east-coast ports round Sri Lanka; west-coast legs stay offshore. */
function seaPath(aId: string, bId: string): [number, number][] {
  const a = portById[aId];
  const b = portById[bId];
  const pts: [number, number][] = [[a.lat, a.lon]];
  const west = (x: Port) => x.coast === "west";
  if (west(a) !== west(b)) {
    const e = west(a) ? b : a;
    const w = west(a) ? a : b;
    const eastLane: [number, number][] = [
      [e.lat - 0.5, e.lon + 1.0],
      [10.5, 81.2],
      [5.5, 81.0],
      [7.3, 77.2],
    ];
    const westApproach: [number, number][] = [[(7.3 + w.lat) / 2, Math.min(w.lon, 76.3) - 1.2]];
    const lane = [...eastLane, ...westApproach];
    pts.push(...(west(a) ? lane.reverse() : lane));
  } else if (west(a)) {
    const midLat = (a.lat + b.lat) / 2;
    if (Math.abs(a.lat - b.lat) > 1.2) pts.push([midLat, Math.min(a.lon, b.lon) - 0.8]);
  }
  pts.push([b.lat, b.lon]);
  return pts.map(([la, lo]) => project(la, lo));
}

function buildTrip(t: TripPlan, i: number): Trip {
  const vessel = VESSELS.find((v) => v.id === t.vessel)!;
  const total = t.drops.reduce((s, d) => s + d.volume, 0);
  const segs: Segment[] = [];
  let clock = t.start;
  const at = (id: string) => [project(portById[id].lat, portById[id].lon)];
  const push = (s: Omit<Segment, "start" | "end">, dur: number) => {
    segs.push({ ...s, start: clock, end: clock + dur });
    clock += dur;
  };
  push({ phase: "load", path: at(t.from), port: t.from, volume: total }, total / MT_PER_DAY);
  let prev = t.from;
  t.drops.forEach((d, k) => {
    const sail = k === 0 ? LU[t.from][d.port] : UU[prev]?.[d.port] ?? 0.25;
    push({ phase: "sail", path: seaPath(prev, d.port) }, sail);
    push({ phase: "discharge", path: at(d.port), port: d.port, volume: d.volume }, d.volume / MT_PER_DAY);
    prev = d.port;
  });
  push({ phase: "return", path: seaPath(prev, t.from) }, LU[t.from][prev]);
  const days = clock - t.start;
  return {
    ...t,
    id: `${t.vessel}-${i + 1}`,
    end: clock,
    days,
    costCr: days * vessel.rateCrPerDay,
    segments: segs,
  };
}

export const TIMELINE: Trip[] = TRIPS.map(buildTrip);
export const HORIZON = Math.ceil(Math.max(...TIMELINE.map((t) => t.end)) + 0.5);
export const TOTAL_DEMAND = PORTS.reduce((s, p) => s + (p.demand ?? 0), 0);
export const TOTAL_COST_CR = TIMELINE.reduce((s, t) => s + t.costCr, 0);

/** Schematic coastline (lat, lon). Adjusted so dataset port coordinates sit on or off the coast. */
const MAINLAND: [number, number][] = [
  [26, 66], [24.6, 66], [24.6, 68.2], [23.6, 68.4], [22.8, 69.2], [22.3, 69.0], [21.7, 69.5], [20.8, 70.6],
  [20.85, 71.4], [21.6, 72.25], [21.1, 72.75], [20.2, 72.85], [19.3, 72.95], [18.6, 73.3], [18.2, 73.45],
  [17.9, 73.75], [17.3, 73.5], [16.4, 74.3], [16.0, 74.3], [15.5, 74.15], [15.0, 74.75], [14.2, 74.8],
  [12.9, 75.0], [11.2, 75.9], [10.0, 76.5], [8.9, 76.75], [8.1, 77.5], [8.8, 78.2], [9.3, 79.0],
  [10.3, 79.8], [11.8, 79.9], [13.1, 80.2], [15.0, 80.05], [16.0, 81.1], [16.6, 82.2], [17.7, 83.2],
  [18.8, 84.4], [19.8, 85.6], [20.3, 86.6], [21.5, 87.0], [21.6, 88.6], [22.0, 89.0], [22.0, 90.5], [26, 90.5],
];
const SRI_LANKA: [number, number][] = [
  [9.8, 80.0], [9.0, 81.1], [8.0, 81.8], [6.8, 81.8], [6.0, 80.6], [6.4, 80.0], [7.5, 79.8], [8.6, 79.9],
];
const toD = (poly: [number, number][]) =>
  poly.map(([la, lo], i) => `${i ? "L" : "M"}${project(la, lo).join(",")}`).join("") + "Z";
export const LAND_PATHS = [toD(MAINLAND), toD(SRI_LANKA)];

/** Position along a polyline for fraction f in [0,1]. */
export function along(path: [number, number][], f: number): [number, number] {
  if (path.length === 1) return path[0];
  const lens = path.slice(1).map((p, i) => Math.hypot(p[0] - path[i][0], p[1] - path[i][1]));
  let d = Math.max(0, Math.min(1, f)) * lens.reduce((a, b) => a + b, 0);
  for (let i = 0; i < lens.length; i++) {
    if (d <= lens[i] || i === lens.length - 1) {
      const t = lens[i] ? d / lens[i] : 0;
      return [path[i][0] + (path[i + 1][0] - path[i][0]) * t, path[i][1] + (path[i + 1][1] - path[i][1]) * t];
    }
    d -= lens[i];
  }
  return path[path.length - 1];
}
