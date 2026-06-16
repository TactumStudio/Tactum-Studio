import type { NextConfig } from "next";
import os from "os";

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
        hostname: "**.r2.dev",
      },
    ],
    minimumCacheTTL: 2592000,
  },
};

export default nextConfig;
