import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Kitchen and dish photos are uploaded to Google Cloud Storage by the
    // backend; clients never talk to it directly.
    remotePatterns: [{ protocol: "https", hostname: "storage.googleapis.com" }],
  },
};

export default nextConfig;
