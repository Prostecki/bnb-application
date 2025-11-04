import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "upload.wikimedia.org",
        port: "",
        pathname: "/wikipedia/commons/**",
      },
      {
        protocol: "https",
        hostname: "a0.muscache.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "plus.unsplash.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "api.time.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "www.chinadailyhk.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "i.insider.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "media.istockphoto.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "kpcnotebook.scholastic.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "content.api.news",
        port: "",
        pathname: "/**",
      },
    ],
  },
  plugins: {
    "@tailwindcss/postcss": {},
  },
};

export default nextConfig;
