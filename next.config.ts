import type { NextConfig } from "next";
import os from "os";

function getR2Hostname(): string {
  try {
    const url = process.env.NEXT_PUBLIC_R2_PUBLIC_URL;
    return url ? new URL(url).hostname : "*.r2.dev";
  } catch {
    return "*.r2.dev";
  }
}

function getLocalNetworkIPs(): string[] {
  const result: string[] = [];
  for (const iface of Object.values(os.networkInterfaces())) {
    for (const alias of iface ?? []) {
      if (alias.family === "IPv4" && !alias.internal) result.push(alias.address);
    }
  }
  return result;
}

const nextConfig: NextConfig = {
  allowedDevOrigins: getLocalNetworkIPs(),
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: getR2Hostname(),
      },
    ],
  },
};

export default nextConfig;
