/// <reference types="react-scripts" />

declare module "*.module.less" {
  const classes: { readonly [key: string]: string };
  export default classes;
}

interface GridCoordinates {
  x: number;
  y: number;
}

interface ScreenCoordinates {
  x: number;
  y: number;
}

interface Size2D {
  width: number;
  height: number;
}

interface Size3D {
  width: number;
  length: number;
  height: number;
}

interface AreaCoordinates {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

interface MediaAssets {
  image: { [url: string]: AssetFileImage };
  audio: { [url: string]: AssetFileAudio };
}

interface AssetFileImage {
  value: string;
  size: number;
  type: "image";
  source: HTMLImageElement;
}

interface AssetFileAudio {
  value: string;
  size: number;
  type: "audio";
  source: AudioBuffer;
}

type AngleInDegrees = number;
type AngleInRadians = number;
type Angle = {
  deg: AngleInDegrees;
  rad: AngleInRadians;
};
