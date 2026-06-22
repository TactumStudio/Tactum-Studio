import type { NextConfig } from "next";

function getR2Hostname(): string {
  try {
    const url = process.env.NEXT_PUBLIC_R2_PUBLIC_URL;
    return url ? new URL(url).hostname : "**.r2.dev";
  } catch {
    return "**.r2.dev";
  }
}

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: getR2Hostname(),
        port: "",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
