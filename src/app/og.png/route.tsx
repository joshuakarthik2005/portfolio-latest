import { ImageResponse } from "next/og";
import { person, proofPoints } from "@/data/content";

export const dynamic = "force-static";
const size = { width: 1200, height: 630 };

/** Static OG image, emitted as /og.png at build time. */
export function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          background: "#0a0e14",
          color: "#e6edf5",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", fontSize: 26, color: "#6fb3ef", fontFamily: "monospace" }}>~/joshua $ whoami</div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 76, fontWeight: 700, letterSpacing: -2 }}>{person.name}</div>
          <div style={{ fontSize: 34, color: "#a3b0bf", marginTop: 12 }}>{person.positioning}</div>
        </div>
        <div style={{ display: "flex", gap: 20 }}>
          {proofPoints.map((p) => (
            <div
              key={p.label}
              style={{
                display: "flex",
                flexDirection: "column",
                border: "2px solid #2c3a4a",
                borderRadius: 16,
                padding: "18px 24px",
                flex: 1,
              }}
            >
              <div style={{ fontSize: 34, fontWeight: 700, color: "#e6edf5" }}>{p.value}</div>
              <div style={{ fontSize: 20, color: "#8593a3", marginTop: 6 }}>{p.label}</div>
            </div>
          ))}
        </div>
      </div>
    ),
    size,
  );
}
