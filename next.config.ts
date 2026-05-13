import type { NextConfig } from "next";

// Security headers — applied to every response. Tightened CSP later when
// we add web-push (needs 'self' + push.endpoint origins). For now we keep
// CSP conservative-but-not-broken (Razorpay checkout iframes need to load).

const securityHeaders = [
  { key: "X-DNS-Prefetch-Control", value: "on" },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    // microphone=(self) is required for the voice meal logger.
    // notifications + geolocation reserved for later — currently disabled.
    value: "camera=(), microphone=(self), geolocation=(), payment=(self \"https://api.razorpay.com\" \"https://checkout.razorpay.com\")",
  },
  // Loose CSP — Razorpay + UploadThing + Google fonts need network access.
  // Tighten this when the surface stabilizes.
  {
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://checkout.razorpay.com https://*.razorpay.com",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "img-src 'self' data: blob: https:",
      "font-src 'self' https://fonts.gstatic.com",
      "connect-src 'self' https://api.razorpay.com https://*.razorpay.com https://generativelanguage.googleapis.com https://api.groq.com https://api.anthropic.com https://*.huggingface.co https://*.uploadthing.com https://*.utfs.io",
      "frame-src 'self' https://api.razorpay.com https://*.razorpay.com",
      "media-src 'self' blob:",
      "worker-src 'self' blob:",
      "manifest-src 'self'",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
    ].join("; "),
  },
];

const nextConfig: NextConfig = {
  typescript: { ignoreBuildErrors: true },
  eslint: { ignoreDuringBuilds: true },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "*.utfs.io" },
      { protocol: "https", hostname: "img.youtube.com" },
    ],
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
  // Keep server action body limit reasonable for report uploads via base64.
  experimental: {
    serverActions: {
      bodySizeLimit: "10mb",
    },
  },
  turbopack: {
    root: __dirname,
  },
};

export default nextConfig;
