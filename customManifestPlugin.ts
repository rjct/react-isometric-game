/* eslint-disable no-console */

import fs from "fs";
import path from "path";
import { Plugin } from "vite";

interface AssetInfo {
  [relativePath: string]: {
    path: string;
    name: string;
    size: number;
    type: "image" | "audio";
  };
}

interface Manifest {
  image: AssetInfo;
  audio: AssetInfo;
}

function isImage(file: string): boolean {
  const imageExtensions = [".png", ".webp", ".svg"];
  const ext = path.extname(file).toLowerCase();

  return imageExtensions.includes(ext);
}

function isAudio(file: string): boolean {
  const audioExtensions = [".mp3", ".m4a", ".aac"];
  const ext = path.extname(file).toLowerCase();

  return audioExtensions.includes(ext);
}

function readDirectoryRecursively(directoryPath: string, rootPath: string, assetType: string, manifest: Manifest) {
  const files = fs.readdirSync(directoryPath);

  files.forEach((file) => {
    const fullPath = path.resolve(directoryPath, file);
    const stats = fs.statSync(fullPath);

    if (stats.isDirectory()) {
      readDirectoryRecursively(fullPath, rootPath, assetType, manifest);
    } else {
      const relativePath = path.relative(rootPath, fullPath).replace("public", "");

      if (assetType === "image" && isImage(file)) {
        if (!manifest.image) {
          manifest.image = {};
        }

        manifest.image[relativePath] = {
          path: relativePath,
          name: file,
          size: stats.size,
          type: "image",
        };
      } else if (assetType === "audio" && isAudio(file)) {
        if (!manifest.audio) {
          manifest.audio = {};
        }

        manifest.audio[relativePath] = {
          path: relativePath,
          name: file,
          size: stats.size,
          type: "audio",
        };
      }
    }
  });
}

export default function customManifestPlugin(folderPath: string): Plugin {
  return {
    name: "custom-manifest-plugin",
    buildStart() {
      const manifest: Manifest = {
        image: {},
        audio: {},
      };

      const directoryPath = path.resolve(__dirname, folderPath);
      const rootPath = path.resolve(__dirname);

      readDirectoryRecursively(directoryPath, rootPath, "image", manifest);
      readDirectoryRecursively(directoryPath, rootPath, "audio", manifest);

      const manifestContent = JSON.stringify(manifest, null, 2);
      const manifestFilePath = path.resolve(directoryPath, "media-assets-manifest.json");

      fs.writeFileSync(manifestFilePath, manifestContent);

      console.log("Media assets manifest file generated at:", manifestFilePath);
      console.log("    Images:", Object.keys(manifest.image).length);
      console.log("    Audio: ", Object.keys(manifest.audio).length);
    },
  };
}
