import { ImageResponse } from "next/og";
import { dark } from "@/theme";

export const alt = "Karrigo — food and groceries delivered in Makurdi";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** The card WhatsApp, Facebook and Google show when a link is shared. */
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: 80,
          background: dark.bg,
          color: dark.cream,
        }}
      >
        <div style={{ fontSize: 40, fontWeight: 800, color: dark.accent }}>Karrigo</div>
        <div style={{ fontSize: 88, fontWeight: 800, lineHeight: 1.05, marginTop: 24, letterSpacing: -3 }}>
          Food, groceries, at your doorstep.
        </div>
        <div style={{ fontSize: 36, marginTop: 32, opacity: 0.66 }}>Delivered across Makurdi</div>
      </div>
    ),
    size,
  );
}
