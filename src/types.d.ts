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
    grid: Coordinates;
    screen: Coordinates;
  };
  size: {
    grid: Size;
    screen: Size;
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

interface Coordinates {
  x: number;
  y: number;
}

interface Size {
  width: number;
  height: number;
}

interface ExitPoint {
  area: { x1: number; y1: number; x2: number; y2: number };
  map: string;
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
