import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "image-cdn-ak.spotifycdn.com" },
      { protocol: "https", hostname: "image-cdn-fa.spotifycdn.com" },
      { protocol: "https", hostname: "i.scdn.co" },
      { protocol: "https", hostname: "i.ytimg.com" },
      { protocol: "https", hostname: "www.gr6.com.br" },
      { protocol: "https", hostname: "egobrazil.com.br" },
      { protocol: "https", hostname: "www.nitronewsbrasil.com.br" },
    ],
  },
};

export default nextConfig;
