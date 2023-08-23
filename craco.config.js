const path = require("path");

const WebpackAssetsManifest = require("webpack-assets-manifest");
const CopyPlugin = require("copy-webpack-plugin");

const { homepage } = require("./package.json");

const ALLOWED_MEDIA_ASSETS = {
  image: ["png", "webp", "svg"],
  audio: ["mp3", "m4a", "aac"],
};

const getMediaAssetTypeByExt = (ext) => {
  switch (true) {
    case ALLOWED_MEDIA_ASSETS.image.includes(ext):
      return "image";

    case ALLOWED_MEDIA_ASSETS.audio.includes(ext):
      return "audio";

    default:
      return null;
  }
};

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
        new CopyPlugin({
          patterns: [
            {
              from: `./public/**/*.(${ALLOWED_MEDIA_ASSETS.audio.join("|")})`,
              to({ context, absoluteFilename }) {
                const fullPath = path.relative(context, absoluteFilename).replace("public/assets", "audio").split("/");

                fullPath.unshift("static");
                fullPath.pop();

                return `${fullPath.join("/")}/[name].[fullhash][ext]`;
              },
            },
          ],
        }),
        new WebpackAssetsManifest({
          output: "media-assets-manifest.json",
          publicPath: `/${homepage.split("/").filter(Boolean).pop()}/`,
          customize(entry, original, manifest, asset) {
            const ext = entry.key.split(".")[1];
            const type = getMediaAssetTypeByExt(ext);

            if (!type) {
              return false;
            }

            return {
              key: asset.info.sourceFilename || entry.key,
              value: {
                type,
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
