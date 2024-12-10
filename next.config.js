/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["logandocuments.s3.amazonaws.com"],
  },
  output: "standalone",
};

module.exports = nextConfig;
