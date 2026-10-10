import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    // Photos are shrunk in the browser first, so this is headroom, not the norm.
    serverActions: { bodySizeLimit: "3mb" },
  },
  async redirects() {
    return [
      // The store page was /partners/store before the PM asked for the plural.
      // Links people already have (emails, the footer on cached pages) keep working.
      { source: "/partners/store", destination: "/partners/stores", permanent: true },
    ];
  },
  images: {
    // Kitchen and dish photos are uploaded to Google Cloud Storage by the
    // backend; clients never talk to it directly.
    remotePatterns: [{ protocol: "https", hostname: "storage.googleapis.com" }],
  },
};

export default nextConfig;
