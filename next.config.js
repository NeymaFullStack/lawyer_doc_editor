/** @type {import('next').NextConfig} */
const path = require("path");
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "logandocuments.s3.amazonaws.com",
        pathname: "**",
      },
    ],
  },
  output: "standalone",
  reactStrictMode: false,
  sassOptions: {
    includePaths: [path.join(__dirname, "styles")],
  },
};

module.exports = nextConfig;

// webpack: (config, options) => {
//   /**
//    * Force scss source maps for debugging. If there are performance issues or you don't need debug css, use the value "eval-source-map" instead.
//    */
//   //  comment the webpack code while pushing the code ro production
//   if (options.dev) {
//     Object.defineProperty(config, "devtool", {
//       get() {
//         return "source-map";
//       },
//       set() {},
//     });
//   }
//   console.log("options", options);

//   return config;
// },
