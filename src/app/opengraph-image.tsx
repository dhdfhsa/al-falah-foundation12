import { ImageResponse } from "next/og";
import { SITE_DESCRIPTION, SITE_NAME } from "@/lib/site";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "64px",
          background:
            "radial-gradient(circle at top left, rgba(201,145,42,0.28), transparent 36%), linear-gradient(135deg, #08153f 0%, #0f1e54 42%, #111827 100%)",
          color: "#f8fafc",
          fontFamily: "Inter, Arial, sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "18px",
          }}
        >
          <div
            style={{
              width: "86px",
              height: "86px",
              borderRadius: "28px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "linear-gradient(145deg, #1a2d7c, #243a96)",
              boxShadow: "0 18px 50px rgba(0,0,0,0.35)",
            fontSize: "42px",
          }}
          >
            AF
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ fontSize: "30px", fontWeight: 800, letterSpacing: "0.02em" }}>
              {SITE_NAME}
            </div>
            <div style={{ fontSize: "16px", color: "rgba(248,250,252,0.8)" }}>
              Service to Creation, Service to the Creator
            </div>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "18px", maxWidth: "900px" }}>
          <div style={{ fontSize: "66px", lineHeight: 1.02, fontWeight: 900 }}>
            Charity, relief, and community care across Bangladesh.
          </div>
          <div style={{ fontSize: "28px", lineHeight: 1.35, color: "rgba(248,250,252,0.86)" }}>
            {SITE_DESCRIPTION}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            gap: "14px",
            alignItems: "center",
            fontSize: "20px",
            color: "rgba(248,250,252,0.9)",
          }}
        >
          <span style={{ padding: "12px 18px", borderRadius: "999px", background: "rgba(201,145,42,0.16)" }}>
            Education
          </span>
          <span style={{ padding: "12px 18px", borderRadius: "999px", background: "rgba(201,145,42,0.16)" }}>
            Food Aid
          </span>
          <span style={{ padding: "12px 18px", borderRadius: "999px", background: "rgba(201,145,42,0.16)" }}>
            Healthcare
          </span>
        </div>
      </div>
    ),
    size,
  );
}
