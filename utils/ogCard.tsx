import { ImageResponse } from "next/og";

export const ogSize = { width: 1200, height: 630 };

// Shared social card: title + up to 3 stats.
export function ogCard(
  eyebrow: string,
  title: string,
  stats: { label: string; value: string }[] = []
) {
  return new ImageResponse(
    (
      <div style={{ display: "flex", width: "100%", height: "100%", color: "white" }}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            width: "100%",
            height: "100%",
            padding: "60px 70px",
            background: "linear-gradient(135deg, #111 0%, #3b0d0d 100%)",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ fontSize: 30, color: "#f87171", textTransform: "uppercase", letterSpacing: 2 }}>{eyebrow}</div>
            <div style={{ fontSize: title.length > 40 ? 56 : 72, fontWeight: 700, lineHeight: 1.1, marginTop: 12 }}>
              {title}
            </div>
          </div>
          {stats.length > 0 && (
            <div style={{ display: "flex", gap: 60 }}>
              {stats.map((s) => (
                <div key={s.label} style={{ display: "flex", flexDirection: "column", flex: 1 }}>
                  <div style={{ fontSize: s.value.length > 10 ? 40 : 60, color: "#f87171" }}>{s.value}</div>
                  <div style={{ fontSize: 26, color: "#d1d5db" }}>{s.label}</div>
                </div>
              ))}
            </div>
          )}
          <div style={{ fontSize: 30, fontWeight: 700 }}>PalmWatch</div>
        </div>
      </div>
    ),
    ogSize
  );
}

export const fmt = (n: unknown) =>
  n !== null && n !== "" && isFinite(Number(n))
    ? Number(n).toLocaleString("en-US", { maximumFractionDigits: 1 })
    : "N/A";
