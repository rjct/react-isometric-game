const WebpackAssetsManifest = require("webpack-assets-manifest");

const { homepage } = require("./package.json");

module.exports = {
  typescript: {
    enableTypeChecking: true,
  },
  eslint: {
    enable: true,
  },
  webpack: {
    plugins: {
      remove: ["WebpackAssetsManifest"],
      add: [
        new WebpackAssetsManifest({
          output: "media-assets-manifest.json",
          publicPath: `/${homepage.split("/").filter(Boolean).pop()}/`,
          customize(entry, original, manifest, asset) {
            const ext = entry.key.split(".")[1];
            const allowedExts = ["png", "webp", "svg"];

            if (!allowedExts.includes(ext)) {
              return false;
            }

            return {
              key: asset.info.sourceFilename || entry.key,
              value: {
                value: entry.value,
                size: asset.source.size(),
              },
            };
          },
        }),
      ],
    },
  },
};
