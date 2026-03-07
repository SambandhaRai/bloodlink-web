import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["127.0.0.1", "localhost"],
  images: {
    dangerouslyAllowLocalIP: true,
    remotePatterns: [
      {
        hostname: "localhost",
        port: "5050",
        protocol: "http",
        pathname: "/uploads/**",
      },
    ],
  },
};

export default nextConfig;
