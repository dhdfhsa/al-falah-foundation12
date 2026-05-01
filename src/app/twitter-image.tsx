import { ImageResponse } from "next/og";
import { SITE_DESCRIPTION, SITE_NAME } from "@/lib/site";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default function TwitterImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "60px",
          background:
            "linear-gradient(135deg, #0b163d 0%, #10255f 58%, #0f172a 100%)",
          color: "#f8fafc",
          fontFamily: "Inter, Arial, sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <div
            style={{
              width: "78px",
              height: "78px",
              borderRadius: "24px",
              background: "#c9912a",
              color: "#0f172a",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "40px",
              fontWeight: 900,
            }}
          >
            AF
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ fontSize: "28px", fontWeight: 800 }}>{SITE_NAME}</div>
            <div style={{ fontSize: "15px", color: "rgba(248,250,252,0.78)" }}>
              Bangladesh charity and relief work
            </div>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "14px", maxWidth: "910px" }}>
          <div style={{ fontSize: "62px", lineHeight: 1.05, fontWeight: 900 }}>
            Serving families through education, food, and care.
          </div>
          <div style={{ fontSize: "26px", lineHeight: 1.36, color: "rgba(248,250,252,0.86)" }}>
            {SITE_DESCRIPTION}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            gap: "12px",
            fontSize: "18px",
            color: "rgba(248,250,252,0.92)",
          }}
        >
          <span style={{ padding: "10px 16px", borderRadius: "999px", background: "rgba(255,255,255,0.08)" }}>
            Donate
          </span>
          <span style={{ padding: "10px 16px", borderRadius: "999px", background: "rgba(255,255,255,0.08)" }}>
            Support
          </span>
          <span style={{ padding: "10px 16px", borderRadius: "999px", background: "rgba(255,255,255,0.08)" }}>
            Share
          </span>
        </div>
      </div>
    ),
    size,
  );
}
