/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    unoptimized: true,
    loader: "imgix",
    path: "https://noop/",
    domains: [
      "img.freepik.com",
      "firebasestorage.googleapis.com",
      "graph.facebook.com",
      "lh3.googleusercontent.com",
    ],
  },
};

module.exports = nextConfig;
