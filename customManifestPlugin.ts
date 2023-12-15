/* eslint-disable no-console, no-restricted-imports */

import { filesize } from "filesize";
import fs from "fs";
import path from "path";
import { Plugin } from "vite";

interface AssetInfo {
  total: {
    count: number;
    size: number;
  };
  files: {
    [relativePath: string]: {
      path: string;
      name: string;
      size: number;
      type: "image" | "audio";
    };
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

function readDirectoryRecursively(
  directoryPath: string,
  rootPath: string,
  assetType: string,
  manifest: Manifest,
  baseUrl: string,
) {
  const files = fs.readdirSync(directoryPath);

  files.forEach((file) => {
    const fullPath = path.resolve(directoryPath, file);
    const stats = fs.statSync(fullPath);

    if (stats.isDirectory()) {
      readDirectoryRecursively(fullPath, rootPath, assetType, manifest, baseUrl);
    } else {
      const relativePath = path.relative(rootPath, fullPath).replace("public", "");
      const fullRelativePath = path.relative(rootPath, fullPath).replace("public", baseUrl);

      if (assetType === "image" && isImage(file)) {
        manifest.image.total.count++;
        manifest.image.total.size += stats.size;
        manifest.image.files[relativePath] = {
          path: fullRelativePath,
          name: file,
          size: stats.size,
          type: "image",
        };
      } else if (assetType === "audio" && isAudio(file)) {
        manifest.audio.total.count++;
        manifest.audio.total.size += stats.size;
        manifest.audio.files[relativePath] = {
          path: fullRelativePath,
          name: file,
          size: stats.size,
          type: "audio",
        };
      }
    }
  });
}

export default function customManifestPlugin(folderPath: string, baseUrl: string): Plugin {
  return {
    name: "custom-manifest-plugin",
    buildStart() {
      const manifest: Manifest = {
        image: {
          total: {
            count: 0,
            size: 0,
          },
          files: {},
        },
        audio: {
          total: {
            count: 0,
            size: 0,
          },
          files: {},
        },
      };

      const directoryPath = path.resolve(__dirname, folderPath);
      const rootPath = path.resolve(__dirname);

      readDirectoryRecursively(directoryPath, rootPath, "image", manifest, baseUrl);
      readDirectoryRecursively(directoryPath, rootPath, "audio", manifest, baseUrl);

      const manifestContent = JSON.stringify(manifest, null, 2);
      const manifestFilePath = path.resolve(directoryPath, "media-assets-manifest.json");

      fs.writeFileSync(manifestFilePath, manifestContent);

      console.log("Media assets manifest file generated at:", manifestFilePath);
      console.log("    Images:", manifest.image.total.count, filesize(manifest.image.total.size));
      console.log("    Audio: ", manifest.audio.total.count, filesize(manifest.audio.total.size));
    },
  };
}
