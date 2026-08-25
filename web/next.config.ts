import path from 'node:path';

import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Development only. Without this, `next dev` blocks its JS chunks when the
  // page is opened through a tunnel, React never hydrates, and the hero's
  // curtain panels stay down over a blank screen. Wildcards matter: ngrok
  // free-tier subdomains change on every restart.
  allowedDevOrigins: ['*.ngrok-free.app', '*.ngrok.app', '*.ngrok.io', '*.trycloudflare.com'],
  // This app is self-contained; pin the root so Turbopack does not walk up
  // past the repo looking for a lockfile.
  turbopack: { root: path.resolve(__dirname) },
  images: {
    // Placeholder photography. Remove this once the real Kalope photos
    // live in `public/`.
    remotePatterns: [{ protocol: 'https', hostname: 'images.unsplash.com' }],
  },
};

export default nextConfig;
