import { constants } from "@src/constants";
import { StaticMapTerrainArea } from "@src/context/GameStateContext";
import { GameMap } from "@src/engine/GameMap";
import { composeSpriteUrl, gridToScreenSpace, randomInt, randomUUID } from "@src/engine/helpers";

export interface TerrainTile {
  id: string;
  type: string;
  backgroundPosition: GridCoordinates;
  position: GridCoordinates;
  screenPosition: {
    screen: ScreenCoordinates;
    iso: ScreenCoordinates;
  };
  size: {
    grid: Size3D;
    screen: Size2D;
  };
  isMapExit: boolean;
}

export enum TerrainAreaTypes {
  "empty" = "Empty",
  "earth" = "Earth",
  "vault" = "Vault",
}

export type TerrainAreaType = keyof typeof TerrainAreaTypes;

export class TerrainArea {
  private readonly mapSize: GameMap["mapSize"];
  readonly id = randomUUID();
  source: { type: TerrainAreaType; position: AreaCoordinates };
  target: AreaCoordinates;
  exitUrl: string | null;
  tiles: { [coordinates: string]: TerrainTile };
  backgrounds: GridCoordinates[][] = [];

  constructor(terrainArea: StaticMapTerrainArea, mapSize: GameMap["mapSize"]) {
    this.mapSize = { ...mapSize };
    this.source = terrainArea.source;
    this.target = terrainArea.target;
    this.exitUrl = terrainArea.exitUrl;
    this.tiles = {};

    this.composeRandomBackgrounds();
    this.composeTiles();
  }

  composeRandomBackgrounds() {
    const width = Math.max(1, this.target.x2 - this.target.x1);
    const height = Math.max(1, this.target.y2 - this.target.y1);

    for (let x = 0; x < width; x++) {
      if (!this.backgrounds[x]) this.backgrounds[x] = [];

      for (let y = 0; y < height; y++) {
        this.backgrounds[x][y] = {
          x: randomInt(this.source.position.x1, this.source.position.x2),
          y: randomInt(this.source.position.y1, this.source.position.y2),
        };
      }
    }
  }

  setType(type: TerrainAreaType) {
    this.source.type = type;

    this.composeRandomBackgrounds();
    this.composeTiles();
  }
  composeTiles() {
    for (let xx = 0, x = this.target.x1; x < this.target.x2; x++, xx++) {
      for (let yy = 0, y = this.target.y1; y < this.target.y2; y++, yy++) {
        const key = `${x}:${y}`;
        const type = composeSpriteUrl(this.source.type);
        const bg = this.backgrounds[xx]?.[yy];

        this.tiles[key] = {
          id: key,
          isMapExit: !!this.exitUrl,
          type,
          backgroundPosition: bg,
          position: { x, y },
          screenPosition: {
            screen: gridToScreenSpace({ x, y }, this.mapSize),
            iso: {
              x: (x - y) * (constants.tileSize.width / 2) + (this.mapSize.width / 2 - 0.5) * constants.tileSize.width,
              y: (x + y) * (constants.tileSize.height / 2),
            },
          },
          size: {
            grid: { width: 1, height: 1, length: 1 },
            screen: {
              width: constants.tileSize.width,
              height: constants.tileSize.height,
            },
          },
        };
      }
    }
  }

  moveTo(coordinates: GridCoordinates) {
    const shiftX = this.target.x1 - coordinates.x;
    const shiftY = this.target.y1 - coordinates.y;

    this.target.x1 = coordinates.x;
    this.target.y1 = coordinates.y;
    this.target.x2 -= shiftX;
    this.target.y2 -= shiftY;

    this.composeTiles();
  }

  resizeTo(size: Size2D) {
    this.target.x2 = this.target.x1 + Math.max(1, size.width);
    this.target.y2 = this.target.y1 + Math.max(1, size.height);

    this.composeRandomBackgrounds();
    this.composeTiles();
  }

  setSourcePosition(coordinates: AreaCoordinates) {
    this.source.position = { ...coordinates };

    this.composeRandomBackgrounds();
    this.composeTiles();
  }

  getScreenCoordinates(): ScreenCoordinates {
    return {
      x: this.target.x1 * constants.wireframeTileSize.width,
      y: this.target.y1 * constants.wireframeTileSize.height,
    };
  }

  getScreenSize(): Size2D {
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
