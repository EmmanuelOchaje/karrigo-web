import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  experimental: {
    // Photos are shrunk in the browser first, so this is headroom, not the norm.
    serverActions: { bodySizeLimit: "3mb" },
  },
  images: {
    // Kitchen and dish photos are uploaded to Google Cloud Storage by the
    // backend; clients never talk to it directly.
    remotePatterns: [{ protocol: "https", hostname: "storage.googleapis.com" }],
  },
}

export default nextConfig
