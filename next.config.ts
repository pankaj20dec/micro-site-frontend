import type { NextConfig } from "next";

const backendOrigin = (process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:5000")
  .replace(/\/$/, "")
  .replace("://localhost", "://127.0.0.1");

const nextConfig: NextConfig = {
  images: {
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${backendOrigin}/api/:path*`,
      },
    ];
  },
  experimental: {
    // DocuSign envelope create + recipient view can exceed nginx/Next's 60s default.
    proxyTimeout: 180_000,
    // Witness/PMI uploads (phone photos) exceed Next 16's 10MB rewrite-proxy default.
    proxyClientMaxBodySize: "20mb",
  },
};

export default nextConfig;
