/// <reference types="react-scripts" />

declare module "*.module.less" {
  const classes: { readonly [key: string]: string };
  export default classes;
}

interface TileProps {
  id: string;
  isActive: boolean;
  isOccupied: boolean;
  position: {
    grid: GridCoordinates;
    screen: ScreenCoordinates;
  };
  size: {
    grid: Size3D;
    screen: Size2D;
  };
  className: string;
  sprite?: {
    url: string;
    x: number;
    y: number;
  };
  direction:
    | "east-start"
    | "west-start"
    | "north-start"
    | "south-start"
    //
    | "east-finish"
    | "west-finish"
    | "north-finish"
    | "south-finish"
    //
    | "north" // ⬆️
    | "north-east" // ↗️
    | "east" // ➡️
    | "south-east" // ️↘️
    | "south" // ⬇️
    | "south-west" // ↙️
    | "west" // ⬅️
    | "north-west" // ↖️
    | null;
  value: Element | string | number;
  style: "target" | "error" | null;
  exitPoint?: string;
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

type Direction = "left" | "top" | "right" | "bottom";

interface MediaFiles {
  [url: string]: AssetFile;
}

interface AssetFile {
  value: string;
  size: number;
  img: HTMLImageElement;
}

type AngleInDegrees = number;
type AngleInRadians = number;
