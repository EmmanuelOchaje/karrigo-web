import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta-sans",
  // latin-ext carries U+20A6, the naira sign. Without it every price on the
  // site falls back to a system font mid-word.
  subsets: ["latin", "latin-ext"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "M-Kart — Makurdi eats. We deliver.",
  description:
    "Order from kitchens around Makurdi. Pay by card, transfer or cash, and follow your rider to your gate.",
};

export const viewport: Viewport = {
  themeColor: "#0E0F0D",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      data-theme="light"
      className={`${plusJakartaSans.variable} h-full antialiased`}
    >
      <body className="font-sans min-h-full flex flex-col">{children}</body>
    </html>
  );
}
