/** @type {import('next').NextConfig} */
const isProd = process.env.NODE_ENV === "production";

const nextConfig = {
  output: "export",
  trailingSlash: true,
  basePath: isProd ? "/letters-longing" : "",
  assetPrefix: isProd ? "/letters-longing/" : "",
  images: {
    unoptimized: true
  }
};

export default nextConfig;
