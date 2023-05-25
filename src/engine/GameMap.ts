import { getWireframeTilePathDirection } from "./helpers";
import { Building } from "./BuildingFactory";
import { Unit, UnitTypes } from "./UnitFactory";
import { constants } from "../constants";
import React from "react";
import { Tile } from "../components/map/terrain/Tile";
import { GameUI } from "../context/GameUIContext";
import { TerrainArea } from "./TerrainAreaFactory";
import { WeaponTypes } from "./weapon/WeaponFactory";

interface GameMapProps {
  mapSize: Size;
  terrain: TerrainArea[];
  buildings: Building[];
  units: UnitTypes;
  weapon: WeaponTypes;
}

export type GameMap = typeof gameMap;

export const gameMap = {
  debug: false,

  mapUrl: "maps/map_1.json",

  mapSize: {
    width: 0,
    height: 0,
  } as GameMapProps["mapSize"],
  terrain: [] as GameMapProps["terrain"],

  buildings: [] as GameMapProps["buildings"],
  heroId: "",
  units: {} as GameMapProps["units"],
  weapon: {} as GameMapProps["weapon"],

  wireframe: [] as Array<Array<TileProps>>,
  matrix: [] as Array<Array<number>>,
  fogOfWarMatrix: [] as Array<Array<number>>,
  mediaFiles: {} as MediaFiles,

  selectedBuilding: null as unknown as Building,
  selectedTerrainArea: null as unknown as TerrainArea,

  highlightWireframeCell(coordinates: Coordinates) {
    this.wireframe[coordinates.y][coordinates.x].isActive = true;
  },

  setHighlightedWireframeCellDirection(coordinates: Coordinates, direction: TileProps["direction"]) {
    this.wireframe[coordinates.y][coordinates.x].direction = direction;
  },

  setWireframeCellValue(coordinates: Coordinates, value: TileProps["value"]) {
    this.wireframe[coordinates.y][coordinates.x].value = value;
  },

  clearWireframeCell(coordinates: Coordinates) {
    this.wireframe[coordinates.y][coordinates.x].isActive = false;
    this.wireframe[coordinates.y][coordinates.x].value = "";
    this.wireframe[coordinates.y][coordinates.x].direction = null;
    this.wireframe[coordinates.y][coordinates.x].style = null;
  },

  highlightWireframePath(path: number[][]) {
    if (path.length === 0) return;

    path.forEach((pathPoint, index) => {
      this.highlightWireframeCell({ x: pathPoint[0], y: pathPoint[1] });
      this.setHighlightedWireframeCellDirection(
        { x: pathPoint[0], y: pathPoint[1] },
        getWireframeTilePathDirection(path[index - 1], pathPoint, path[index + 1])
      );
    });

    const lastPathPoint = path[path.length - 1];

    this.setWireframeCellValue({ x: lastPathPoint[0], y: lastPathPoint[1] }, String(path.length - 1));
  },

  clearHighlightWireframePath() {
    this.wireframe.forEach((column) => {
      column.forEach((tile) => {
        this.clearWireframeCell(tile.position.grid);
      });
    });

    this.wireframe = [...this.wireframe];
  },

  setHighlightWireframeCellStyle(coordinates: Coordinates, style: TileProps["style"]) {
    this.wireframe[coordinates.y][coordinates.x].style = style;
  },

  occupyCell(coordinates: Coordinates) {
    this.matrix[Math.round(coordinates.y)][Math.round(coordinates.x)]++;
  },

  deOccupyCell(coordinates: Coordinates) {
    const value = this.matrix[Math.round(coordinates.y)][Math.round(coordinates.x)];

    this.matrix[Math.round(coordinates.y)][Math.round(coordinates.x)] = Math.max(0, value - 1);
  },

  isCellOccupied(coordinates: Coordinates) {
    return this.matrix[Math.round(coordinates.y)][Math.round(coordinates.x)] > 0;
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

  isUnitIsInExitPoint(unit: Unit) {
    const { position } = unit;
    const terrainArea = this.getTerrainAreaByCoordinates(position);

    return !!terrainArea.exitUrl;
  },

  getTerrainAreaByCoordinates(coordinates: Coordinates): TerrainArea {
    const { x, y } = coordinates;

    return this.terrain.find((terrainArea) => {
      const { x1, y1, x2, y2 } = terrainArea.target;

      return x >= x1 && x < x2 && y >= y1 && y < y2;
    })!;
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

  getBuildingById(id: string) {
    return this.buildings.find((building) => building.id === id);
  },

  deleteBuilding(id: string) {
    const index = this.buildings.findIndex((entity) => entity.id === id);

    if (index === -1) return;

    this.setGridMatrixOccupancy([this.buildings[index]], this.matrix, -1);
    this.buildings.splice(index, 1);
  },

  deleteSelectedBuilding() {
    if (!this.selectedBuilding) return false;

    const confirmDelete = confirm(`Are you sure to delete building #"${this.selectedBuilding.id}"?`);

    if (!confirmDelete) return false;

    this.deleteBuilding(this.selectedBuilding.id);
    this.selectedBuilding = null as unknown as Building;

    return true;
  },

  getTerrainAreaById(id: string) {
    return this.terrain.find((terrainArea) => terrainArea.id === id);
  },

  deleteTerrainArea(id: string) {
    const index = this.terrain.findIndex((entity) => entity.id === id);

    if (index === -1) return;

    this.terrain.splice(index, 1);
  },

  deleteSelectedTerrainArea() {
    if (!this.selectedTerrainArea) return false;

    const confirmDelete = confirm(`Are you sure to delete terrain area #"${this.selectedTerrainArea.id}"?`);

    if (!confirmDelete) return false;

    this.deleteTerrainArea(this.selectedTerrainArea.id);
    this.selectedTerrainArea = null as unknown as TerrainArea;

    return true;
  },

  Ray: class {
    constructor(public superThis: typeof gameMap) {}

    a() {
      return this.superThis;
    }
  },
};
