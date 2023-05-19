import { StaticMapTerrainArea } from "../context/GameStateContext";
import { composeSpriteUrl, randomInt } from "./helpers";
import { constants } from "../constants";

export interface TerrainTile {
  type: string;
  x: number;
  y: number;
}

export enum TerrainAreaTypes {
  "empty" = "Empty",
  "earth" = "Earth",
  "vault" = "Vault",
}

export type TerrainAreaType = keyof typeof TerrainAreaTypes;
export type TerrainAreaCoordinates = { x1: number; y1: number; x2: number; y2: number };

export class TerrainArea {
  readonly id = crypto.randomUUID();
  source: { type: TerrainAreaType; position: TerrainAreaCoordinates };
  target: TerrainAreaCoordinates;
  exitUrl: string | null;

  tiles: Map<string, TerrainTile> = new Map();
  backgrounds: Coordinates[][] = [];

  constructor(terrainArea: StaticMapTerrainArea) {
    this.source = terrainArea.source;
    this.target = terrainArea.target;
    this.exitUrl = terrainArea.exitUrl;

    this.composeRandomBackgrounds();
    this.composeTiles();
  }

  composeRandomBackgrounds() {
    const width = Math.max(1, this.target.x2 - this.target.x1);
    const height = Math.max(1, this.target.y2 - this.target.y1);

    this.backgrounds = [...Array(width)].map(() =>
      Array(height)
        .fill(0)
        .map(() => {
          return {
            x: randomInt(this.source.position.x1, this.source.position.x2),
            y: randomInt(this.source.position.y1, this.source.position.y2),
          };
        })
    );
  }

  setType(type: TerrainAreaType) {
    this.source.type = type;

    this.composeRandomBackgrounds();
    this.composeTiles();
  }
  composeTiles() {
    this.tiles = new Map();

    for (let xx = 0, x = this.target.x1; x < this.target.x2; x++, xx++) {
      for (let yy = 0, y = this.target.y1; y < this.target.y2; y++, yy++) {
        const key = `${x}:${y}`;
        const type = composeSpriteUrl(this.source.type);
        const bg = this.backgrounds[xx]?.[yy];

        this.tiles.set(key, {
          ...{ type },
          ...bg,
        });
      }
    }
  }

  moveTo(coordinates: Coordinates) {
    const shiftX = this.target.x1 - coordinates.x;
    const shiftY = this.target.y1 - coordinates.y;

    this.target.x1 = coordinates.x;
    this.target.y1 = coordinates.y;
    this.target.x2 -= shiftX;
    this.target.y2 -= shiftY;

    this.composeTiles();
  }

  resizeTo(size: { width: number; height: number }) {
    this.target.x2 = this.target.x1 + Math.max(1, size.width);
    this.target.y2 = this.target.y1 + Math.max(1, size.height);

    this.composeRandomBackgrounds();
    this.composeTiles();
  }

  setSourcePosition(coordinates: TerrainAreaCoordinates) {
    this.source.position = { ...coordinates };

    this.composeRandomBackgrounds();
    this.composeTiles();
  }

  getScreenCoordinates(): Coordinates {
    return {
      x: this.target.x1 * constants.wireframeTileSize.width,
      y: this.target.y1 * constants.wireframeTileSize.height,
    };
  }

  getScreenSize(): Size {
    return {
      width: (this.target.x2 - this.target.x1) * constants.wireframeTileSize.width,
      height: (this.target.y2 - this.target.y1) * constants.wireframeTileSize.height,
    };
  }

  setExitUrl(url: TerrainArea["exitUrl"]) {
    this.exitUrl = url;
  }

  getJSON(): StaticMapTerrainArea {
    const json: Partial<StaticMapTerrainArea> = {
      source: { ...this.source },
      target: { ...this.target },
    };

    if (this.exitUrl) {
      json.exitUrl = this.exitUrl;
    }

    return json as StaticMapTerrainArea;
  }
}
