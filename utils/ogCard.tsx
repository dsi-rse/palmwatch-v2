import { ImageResponse } from "next/og";

export const ogSize = { width: 1200, height: 630 };

// Shared social card: title, optional subtitle, up to 3 stats.
export function ogCard(
  eyebrow: string,
  title: string,
  stats: { label: string; value: string }[] = [],
  subtitle?: string,
) {
  return new ImageResponse(
    <div
      style={{ display: "flex", width: "100%", height: "100%", color: "white" }}
    >
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
          <div
            style={{
              fontSize: 30,
              color: "#f87171",
              textTransform: "uppercase",
              letterSpacing: 2,
            }}
          >
            {eyebrow}
          </div>
          <div
            style={{
              fontSize: title.length > 60 ? 46 : title.length > 40 ? 56 : 72,
              lineHeight: 1.1,
              marginTop: 12,
            }}
          >
            {title}
          </div>
          {subtitle && (
            <div style={{ fontSize: 24, color: "#d1d5db", marginTop: 12 }}>
              {subtitle}
            </div>
          )}
        </div>
        {stats.length > 0 && (
          <div style={{ display: "flex", gap: 60 }}>
            {stats.map((s) => (
              <div
                key={s.label}
                style={{ display: "flex", flexDirection: "column", flex: 1 }}
              >
                <div
                  style={{
                    fontSize: s.value.length > 10 ? 40 : 60,
                    color: "#f87171",
                  }}
                >
                  {s.value}
                </div>
                <div style={{ fontSize: 26, color: "#d1d5db" }}>{s.label}</div>
              </div>
            ))}
          </div>
        )}
        <div style={{ fontSize: 30 }}>PalmWatch</div>
      </div>
    </div>,
    ogSize,
  );
}

const GENERIC_TITLE = "Tracking the Impact of Big Brands' Palm Oil Use";
export const GENERIC_ALT = `PalmWatch: ${GENERIC_TITLE}`;

// Card for names not in the data. Never put URL text on a PalmWatch-branded image:
// anyone could share a link whose preview reads like a PalmWatch claim.
export const genericCard = () => ogCard("PalmWatch", GENERIC_TITLE);

// Averaged scores use 2 digits to match the pages (e.g. 3.03); totals use 1.
export const fmt = (n: unknown, digits = 1) =>
  n !== null && n !== "" && isFinite(Number(n))
    ? Number(n).toLocaleString("en-US", { maximumFractionDigits: digits })
    : "N/A";

// Params can arrive URL-encoded (page metadata) or already decoded (image route), so decode once and tolerate stray "%".
export const safeDecode = (s: string) => {
  try {
    return decodeURIComponent(s);
  } catch {
    return s;
  }
};

// generateImageMetadata payload: one image per page, with page-specific alt text.
export const cardMeta = (alt: string) => [
  { id: "card", size: ogSize, contentType: "image/png", alt },
];
