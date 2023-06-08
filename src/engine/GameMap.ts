import { Building } from "./BuildingFactory";
import { Unit, UnitTypes } from "./UnitFactory";
import { constants } from "../constants";
import { GameUI } from "../context/GameUIContext";
import { TerrainArea } from "./TerrainAreaFactory";
import { WeaponTypes } from "./weapon/WeaponFactory";
import { pathFinder } from "./pathFinder";
import { Light } from "./LightFactory";

interface GameMapProps {
  mapSize: Size;
  terrain: TerrainArea[];
  buildings: Building[];
  units: UnitTypes;
  lights: Light[];
  weapon: WeaponTypes;
}

export type GameMap = typeof gameMap;

export const gameMap = {
  debug: {
    enabled: false,
    featureEnabled: {
      fogOfWar: true,
      wireframe: true,
      occupiedCells: false,
      unitPath: false,
      enemyDetectionRange: false,
      light: true,
      shadow: true,
      unitShadow: true,
      unitShadowVectors: false,
    },
  },

  mapUrl: "maps/map_1.json",

  mapSize: {
    width: 0,
    height: 0,
  } as GameMapProps["mapSize"],
  terrain: [] as GameMapProps["terrain"],

  buildings: [] as GameMapProps["buildings"],
  heroId: "",
  units: {} as GameMapProps["units"],
  lights: [] as GameMapProps["lights"],
  weapon: {} as GameMapProps["weapon"],

  matrix: [] as Array<Array<number>>,
  fogOfWarMatrix: [] as Array<Array<number>>,
  mediaFiles: {} as MediaFiles,

  selectedBuilding: null as unknown as Building,
  selectedTerrainArea: null as unknown as TerrainArea,
  selectedLight: null as unknown as Light,

  getHero() {
    return this.units[this.heroId];
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

  setGridMatrixOccupancy(items: Array<Unit | Building>, matrix: Array<Array<number>>, occupancy = 1) {
    items.forEach((item) => {
      const { x, y } = item.position;
      const { width, height } = item.size.grid;

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

  screenSpaceToGridSpace(screenPos: Coordinates): Coordinates {
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

  calcUnitPath(unit: Unit, destinationPosition: Coordinates) {
    const unitPath = pathFinder(this.matrix, unit.position, {
      x: Math.min(this.mapSize.width - 1, destinationPosition.x),
      y: Math.min(this.mapSize.height - 1, destinationPosition.y),
    });

    if (unitPath.length > 0) {
      if (unit.position.x !== unitPath[0][0] || unit.position.y !== unitPath[0][1]) {
        unitPath.splice(0, 1, [unit.position.x, unit.position.y]);
      }
    }

    return unitPath;
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

  deleteSelectedTerrainArea() {
    if (!this.selectedTerrainArea) return false;

    const confirmDelete = confirm(`Are you sure to delete terrain area #"${this.selectedTerrainArea.id}"?`);

    if (!confirmDelete) return false;

    this.deleteEntity("terrain", this.selectedTerrainArea.id);
    this.selectedTerrainArea = null as unknown as TerrainArea;

    return true;
  },

  getLightById(id: string) {
    return this.lights.find((light) => light.id === id);
  },

  deleteSelectedLight() {
    if (!this.selectedLight) return false;

    const confirmDelete = confirm(`Are you sure to delete light #"${this.selectedLight.id}"?`);

    if (!confirmDelete) return false;

    this.deleteEntity("lights", this.selectedLight.id);
    this.selectedLight = null as unknown as Light;

    return true;
  },

  deleteEntity(entityType: "terrain" | "lights", id: string) {
    const index = this[entityType].findIndex((entity) => entity.id === id);

    if (index === -1) return;

    this[entityType].splice(index, 1);
  },
};
