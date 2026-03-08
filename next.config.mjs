import {
  PHASE_DEVELOPMENT_SERVER,
  PHASE_PRODUCTION_BUILD,
} from "next/constants.js";

/** @type {import("next").NextConfig} */
const nextConfig = (phase) => {
  const isDev = phase === PHASE_DEVELOPMENT_SERVER;
  const isProd =
    phase === PHASE_PRODUCTION_BUILD && process.env.STAGING !== "1";
  const isStaging =
    phase === PHASE_PRODUCTION_BUILD && process.env.STAGING === "1";

  return {

    async rewrites() {
      return [
        {
          source: "/",
          destination: "/theme/paris",
        },
      ];
    },

    images: {
      remotePatterns: [
        {
          protocol: "https",
          hostname: "fastkart.webiots.co.in",
          pathname: "/**",
        },
        {
          protocol: "https",
          hostname: "picsum.photos",
          pathname: "/**",
        },
        {
          protocol: "https",
          hostname: "laravel.pixelstrap.net",
          pathname: "/**",
        },
        {
          protocol: "https",
          hostname: "react.pixelstrap.net",
          pathname: "/**",
        },
        {
          protocol: "https",
          hostname: "images.unsplash.com",
          pathname: "/**",
        },
        {
          protocol: "https",
          hostname: "somewhrlightsail.s3.ap-south-1.amazonaws.com",
          pathname: "/**",
        },
      ],
    },
  };
};

export default nextConfig;
