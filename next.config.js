/** @type {import('next').NextConfig} */
const path = require("path");
const nextConfig = {
  output:"standalone",
  reactStrictMode: false,
  sassOptions: {
    includePaths: [path.join(__dirname, "styles")],
  },
};

module.exports = nextConfig;


