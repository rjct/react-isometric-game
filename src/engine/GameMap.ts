import { composeSpriteUrl, getWireframeTilePathDirection, randomInt } from "./helpers";
import { Building } from "./BuildingFactory";
import { Unit, UnitTypes } from "./UnitFactory";
import { constants } from "../constants";
import React from "react";
import { Tile } from "../components/map/terrain/Tile";
import { GameUI } from "../context/GameUIContext";
import { StaticMap } from "../context/GameStateContext";
import { createHero } from "./createHero";

interface GameMapProps {
  mapSize: Size;
  terrain: StaticMap["terrain"];
  buildings: Building[];
  units: UnitTypes;
}

const hero = createHero();

export type GameMap = typeof gameMap;

export const gameMap = {
  debug: false,

  mapUrl: "maps/map_1.json",

  mapSize: {
    width: 0,
    height: 0,
  } as GameMapProps["mapSize"],
  terrain: {} as GameMapProps["terrain"],
  terrainSpritesDict: new Map() as Map<string, { url: string; x: number; y: number }>,

  buildings: [] as GameMapProps["buildings"],
  heroId: hero.id,
  units: {
    [hero.id]: hero,
  } as GameMapProps["units"],

  tiles: [] as Array<Array<TileProps>>,
  wireframe: [] as Array<Array<TileProps>>,
  matrix: [] as Array<Array<number>>,
  fogOfWarMatrix: [] as Array<Array<number>>,
  mediaFiles: {} as MediaFiles,

  selectedEntity: null as unknown as Building,

  exitPoints: [] as StaticMap["exitPoints"],

  highlightWireframeCell(x: number, y: number) {
    this.wireframe[y][x].isActive = true;
  },

  setHighlightedWireframeCellDirection(x: number, y: number, direction: TileProps["direction"]) {
    this.wireframe[y][x].direction = direction;
  },

  setWireframeCellValue(x: number, y: number, value: TileProps["value"]) {
    this.wireframe[y][x].value = value;
  },

  clearWireframeCell(x: number, y: number) {
    this.wireframe[y][x].isActive = false;
    this.wireframe[y][x].value = "";
    this.wireframe[y][x].direction = null;
    this.wireframe[y][x].style = null;
  },

  highlightWireframePath(path: number[][]) {
    if (path.length === 0) return;

    path.forEach((pathPoint, index) => {
      this.highlightWireframeCell(pathPoint[0], pathPoint[1]);
      this.setHighlightedWireframeCellDirection(
        pathPoint[0],
        pathPoint[1],
        getWireframeTilePathDirection(path[index - 1], pathPoint, path[index + 1])
      );
    });

    const lastPathPoint = path[path.length - 1];

    this.setWireframeCellValue(lastPathPoint[0], lastPathPoint[1], String(path.length - 1));
  },

  clearHighlightWireframePath() {
    this.wireframe.forEach((column) => {
      column.forEach((tile) => {
        this.clearWireframeCell(tile.position.grid.x, tile.position.grid.y);
      });
    });

    this.wireframe = [...this.wireframe];
  },

  setHighlightWireframeCellStyle(x: number, y: number, style: TileProps["style"]) {
    this.wireframe[y][x].style = style;
  },

  occupyCell(coordinates: Coordinates) {
    this.matrix[Math.round(coordinates.y)][Math.round(coordinates.x)]++;
  },

  deOccupyCell(coordinates: Coordinates) {
    const value = this.matrix[Math.round(coordinates.y)][Math.round(coordinates.x)];

    this.matrix[Math.round(coordinates.y)][Math.round(coordinates.x)] = Math.max(0, value - 1);
  },

  isCellOccupied(x: number, y: number) {
    return this.matrix[Math.round(y)][Math.round(x)] > 0;
  },

  setVisitedCell(coordinates: Coordinates) {
    const radius = constants.FOG_OF_WAR_RADIUS;

    for (let i = coordinates.x - radius; i <= coordinates.x + radius; i++) {
      for (let n = coordinates.y - radius; n <= coordinates.y + radius; n++) {
        const x = Math.max(0, Math.round(n));
        const y = Math.max(0, Math.round(i));

        if ((i - coordinates.x) * (i - coordinates.x) + (n - coordinates.y) * (n - coordinates.y) <= radius * radius) {
          if (x < this.mapSize.width && y < this.mapSize.height) {
            this.fogOfWarMatrix[x][y] = 1;
          }
        }
      }
    }
  },

  isCellVisited(x: number, y: number) {
    return this.fogOfWarMatrix[Math.floor(y)][Math.floor(x)] > 0;
  },

  isEntityVisible(entity: Building | Unit) {
    const radius = constants.FOG_OF_WAR_RADIUS;
    const { x, y } = entity.position;
    const { width, height } = entity.size.grid;

    for (let y1 = Math.max(0, y - radius); y1 < Math.min(this.mapSize.height, y + radius); y1++) {
      for (let x1 = Math.max(0, x - radius); x1 < x + radius; x1++) {
        for (let y2 = y1; y2 < y1 + height + 1; y2++) {
          for (let x2 = x1; x2 < x1 + width + 1; x2++) {
            if (
              this.fogOfWarMatrix[Math.min(this.mapSize.height - 1, Math.round(y2))][
                Math.min(this.mapSize.width - 1, Math.round(x2))
              ] > 0
            ) {
              return true;
            }
          }
        }
      }
    }

    return false;
  },

  composeTileSpritesMap(map: StaticMap) {
    this.terrainSpritesDict = new Map();

    for (let y = 0; y < map.size.width; y++) {
      for (let x = 0; x < map.size.height; x++) {
        this.terrainSpritesDict.set(`${x}:${y}`, { url: "", x: 0, y: 0 });
      }
    }

    map.terrain.area.forEach((area) => {
      for (let x = area.target.x1; x < area.target.x2; x++) {
        for (let y = area.target.y1; y < area.target.y2; y++) {
          const key = `${x}:${y}`;

          const url = composeSpriteUrl(area.source.url);

          this.terrainSpritesDict.set(key, {
            url,
            x: randomInt(area.source.position.x1, area.source.position.x2),
            y: randomInt(area.source.position.y1, area.source.position.y2),
          });
        }
      }
    });
  },

  createTiles(map: StaticMap) {
    const tiles: Array<Array<TileProps>> = [];

    this.composeTileSpritesMap(map);

    for (let y = 0; y < map.size.width; y++) {
      if (!tiles[y]) tiles[y] = [];

      for (let x = 0; x < map.size.height; x++) {
        const key = `${x}:${y}`;

        tiles[y][x] = {
          id: key,
          isActive: false,
          isOccupied: false,
          position: {
            grid: { x, y },
            screen: this.gridToScreenSpace({ x, y }),
          },
          size: {
            grid: {
              width: 1,
              height: 1,
            },
            screen: {
              width: constants.tileSize.width,
              height: constants.tileSize.height,
            },
          },
          className: ``,
          direction: null,
          value: "",
          style: null,
          sprite: this.terrainSpritesDict.get(`${x}:${y}`),
        };
      }
    }

    return tiles;
  },

  createWireframe(mapSize: Size) {
    const wireframe: Array<Array<TileProps & { node: React.ReactElement }>> = [];

    for (let y = 0; y < mapSize.width; y++) {
      if (!wireframe[y]) wireframe[y] = [];

      for (let x = 0; x < mapSize.height; x++) {
        const key = `${x}:${y}`;

        const wireframeTileProps: TileProps = {
          id: key,
          isActive: false,
          isOccupied: false,
          position: {
            grid: { x, y },
            screen: {
              x: x * constants.wireframeTileSize.width,
              y: y * constants.wireframeTileSize.height,
            },
          },
          size: {
            grid: {
              width: 1,
              height: 1,
            },
            screen: {
              width: constants.wireframeTileSize.width,
              height: constants.wireframeTileSize.height,
            },
          },
          className: `wireframe-tile`,
          direction: null,
          value: "",
          style: null,
        };

        wireframe[y][x] = {
          ...wireframeTileProps,
          ...{
            node: React.createElement(Tile, {
              tile: wireframeTileProps,
              isActive: false,
              isOccupied: false,
              value: wireframeTileProps.value,
            }),
          },
        };
      }
    }

    return wireframe;
  },

  setGridMatrixOccupancy(items: Array<Unit | Building>, matrix: Array<Array<number>>, occupancy = 1) {
    items.forEach((item) => {
      const x = item.position.x;
      const y = item.position.y;

      const width = item.size.grid.width;
      const height = item.size.grid.height;

      for (let xx = x; xx < x + width; xx++) {
        for (let yy = y; yy < y + height; yy++) {
          if (xx < this.mapSize.width && yy < this.mapSize.height) {
            matrix[yy][xx] += occupancy;
          }
        }
      }
    });

    return matrix;
  },

  setWireframeMatrixExitPoints(exitPoint: ExitPoint) {
    for (let x = exitPoint.area.x1; x <= exitPoint.area.x2; x++) {
      for (let y = exitPoint.area.y1; y <= exitPoint.area.y2; y++) {
        this.tiles[y][x].exitPoint = exitPoint.map;
      }
    }
  },

  getExitPoints() {
    return this.exitPoints;
  },

  isUnitIsInExitPoint(unit: Unit) {
    if (this.tiles.length == 0) return false;

    const { position } = unit;
    const tile = this.getTileByCoordinates(position);

    return !!tile.exitPoint;
  },

  getTileByCoordinates(coordinates: Coordinates) {
    return this.tiles[Math.round(coordinates.y)][Math.round(coordinates.x)];
  },

  isTileInViewport(tile: TileProps, viewport: GameUI["viewport"]) {
    return this.isEntityInViewport({ position: tile.position.grid, size: tile.size }, viewport);
  },

  isEntityInViewport(
    entity: {
      position: Coordinates;
      size: TileProps["size"];
    },
    viewport: GameUI["viewport"]
  ) {
    const screenPosition = this.gridToScreenSpace(entity.position);
    const x = screenPosition.x;
    const y = screenPosition.y;

    const entityWidth = entity.size.screen.width;
    const entityHeight = entity.size.screen.height;

    const tileWidth = constants.wireframeTileSize.width;
    const tileHeight = constants.wireframeTileSize.height;

    const cache = constants.OFFSCREEN_TILE_CACHE;

    return (
      x + tileWidth * cache >= viewport.x1 &&
      x - entityWidth - tileWidth * cache <= viewport.x2 &&
      y + tileHeight * cache >= viewport.y1 &&
      y - entityHeight - tileHeight * cache <= viewport.y2
    );
  },

  isTileInViewportIsometric(tile: TileProps, viewport: GameUI["viewport"]) {
    const a = Math.round(
      (this.mapSize.width * constants.tileSize.width) / 2 -
        (tile.position.grid.y * constants.tileSize.width) / 2 +
        (tile.position.grid.x * constants.tileSize.width) / 2
    );

    const b = Math.round(
      (tile.position.grid.y * constants.tileSize.height) / 2 + (tile.position.grid.x * constants.tileSize.height) / 2
    );

    return (
      a + constants.wireframeTileSize.width * constants.OFFSCREEN_TILE_CACHE >= viewport.x1 &&
      a <= viewport.x2 &&
      b + constants.wireframeTileSize.height * constants.OFFSCREEN_TILE_CACHE >= viewport.y1 &&
      b <= viewport.y2
    );
  },

  screenSpaceToGridSpace(screenPos: Coordinates) {
    const mapWidth = this.mapSize.width;
    const mapHeight = this.mapSize.height;
    const tileWidth = constants.tileSize.width;
    const tileHeight = constants.tileSize.height;
    const halfWidth = tileWidth / 2;
    const halfHeight = tileHeight / 2;

    const x = 0.5 * ((screenPos.x - (mapWidth / 2 - 0.5) * tileWidth) / halfWidth + screenPos.y / halfHeight);
    const y = 0.5 * (-(screenPos.x - (mapHeight / 2 - 0.5) * tileWidth) / halfWidth + screenPos.y / halfHeight);

    return { x, y };
  },

  gridToScreenSpace(gridPos: Coordinates) {
    const mapWidth = this.mapSize.width;

    const tileWidth = constants.tileSize.width;
    const tileHeight = constants.tileSize.height;

    const halfWidth = tileWidth / 2;
    const halfHeight = tileHeight / 2;

    const x = (gridPos.x - gridPos.y) * halfWidth + (mapWidth / 2 - 0.5) * tileWidth;
    const y = (gridPos.x + gridPos.y) * halfHeight;

    return { x, y };
  },

  getAllAliveUnitsArray() {
    return Object.values(this.units).filter((unit) => !unit.isDead);
  },

  getAliveEnemiesArray() {
    return this.getAllAliveUnitsArray().filter((unit) => unit.id !== this.heroId);
  },

  getUnitByCoordinates(coordinates: Coordinates): Unit | undefined {
    return Object.values(this.units).find(
      (unit) =>
        Math.round(unit.position.x) === Math.round(coordinates.x) &&
        Math.round(unit.position.y) === Math.round(coordinates.y)
    );
  },

  getEntityById(id: string) {
    return this.buildings.find((building) => building.id === id);
  },

  deleteEntity(id: string) {
    const index = this.buildings.findIndex((entity) => entity.id === id);

    if (index === -1) return;

    this.setGridMatrixOccupancy([this.buildings[index]], this.matrix, -1);
    this.buildings.splice(index, 1);
  },

  deleteSelectedEntity() {
    if (!this.selectedEntity) return false;

    const confirmDelete = confirm(`Are you sure to delete "${this.selectedEntity.id}"?`);

    if (!confirmDelete) return false;

    this.deleteEntity(this.selectedEntity.id);
    this.selectedEntity = null as unknown as Building;

    return true;
  },
};
