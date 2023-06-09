import { Building } from "./BuildingFactory";
import { Unit, UnitTypes } from "./UnitFactory";
import { constants, GameDebugFeature, GameFeatureSections, GameSettingsFeature } from "../constants";
import { GameUI } from "../context/GameUIContext";
import { TerrainArea } from "./TerrainAreaFactory";
import { Weapon, WeaponClass, WeaponType, WeaponTypes } from "./weapon/WeaponFactory";
import { pathFinderAStar } from "./pathFinder";
import { Light } from "./LightFactory";
import { MeleeWeapon } from "./weapon/melee/MeleeWeaponFactory";
import { Firearm } from "./weapon/firearm/FirearmFactory";
import { AmmoClass, AmmoType } from "./weapon/AmmoFactory";
import { FirearmAmmo } from "./weapon/firearm/FirearmAmmoFactory";
import { MeleePunch } from "./weapon/melee/meleePunchFactory";
import { getUrlParamValue } from "../hooks/useUrl";
import { floor, gridToScreenSpace } from "./helpers";
import { mapsList } from "../maps_list";

interface GameMapProps {
  mapSize: Size;
  terrain: TerrainArea[];
  buildings: Building[];
  units: UnitTypes;
  lights: Light[];
  weapon: WeaponTypes;
}

export type GameMap = typeof gameMap;

const isFeatureEnabled = (sectionName: GameFeatureSections, featureName: GameSettingsFeature | GameDebugFeature) => {
  const urlValue = getUrlParamValue(featureName);

  if (urlValue === null) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return constants.featureEnabled[sectionName][featureName];
  }

  return urlValue;
};

export const gameMap = {
  settings: {
    featureEnabled: {
      fogOfWar: isFeatureEnabled("settings", "fogOfWar"),
      light: isFeatureEnabled("settings", "light"),
      shadow: isFeatureEnabled("settings", "shadow"),
      unitShadow: isFeatureEnabled("settings", "unitShadow"),
    },
  },

  debug: {
    enabled: false,
    featureEnabled: {
      wireframe: isFeatureEnabled("debug", "wireframe"),
      occupiedCells: isFeatureEnabled("debug", "occupiedCells"),
      unitPath: isFeatureEnabled("debug", "unitPath"),
      unitFieldOfView: isFeatureEnabled("debug", "unitFieldOfView"),
      unitShadowVectors: isFeatureEnabled("debug", "unitShadowVectors"),
      unitInfo: isFeatureEnabled("debug", "unitInfo"),
    },
  },

  shadows: {
    color: "",
    opacity: 0,
  },

  mapUrl: mapsList.vault,

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
  selectedUnit: null as unknown as Unit,
  selectedTerrainArea: null as unknown as TerrainArea,
  selectedLight: null as unknown as Light,

  combatQueue: {
    currentUnitId: null as unknown as string | null,
    units: [] as Array<Unit>,
  },

  getHero() {
    return this.units[this.heroId];
  },

  occupyCell(coordinates: GridCoordinates) {
    this.matrix[Math.round(coordinates.y)][Math.round(coordinates.x)]++;
  },

  deOccupyCell(coordinates: GridCoordinates) {
    const value = this.matrix[Math.round(coordinates.y)][Math.round(coordinates.x)];

    this.matrix[Math.round(coordinates.y)][Math.round(coordinates.x)] = Math.max(0, value - 1);
  },

  isCellOccupied(coordinates: GridCoordinates) {
    return this.matrix[Math.round(coordinates.y)][Math.round(coordinates.x)] > 0;
  },

  setVisitedCell(coordinates: GridCoordinates) {
    const radius = constants.FOG_OF_WAR_RADIUS;

    for (let i = coordinates.x - radius; i <= coordinates.x + radius; i++) {
      for (let n = coordinates.y - radius; n <= coordinates.y + radius; n++) {
        const x = Math.max(0, Math.floor(n));
        const y = Math.max(0, Math.floor(i));

        if ((i - coordinates.x) * (i - coordinates.x) + (n - coordinates.y) * (n - coordinates.y) <= radius * radius) {
          if (x < this.mapSize.width && y < this.mapSize.height) {
            this.fogOfWarMatrix[x][y] = 1;
          }
        }
      }
    }
  },

  isCellVisited(x: number, y: number) {
    return this.fogOfWarMatrix[floor(y)][floor(x)] > 0;
  },

  isEntityVisible(entity: Building | Unit) {
    if (!this.settings.featureEnabled.fogOfWar) return true;

    const { x, y } = entity.position;
    const { width, height } = entity.size.grid;

    const x1 = x;
    const x2 = x1 + width;

    const y1 = y;
    const y2 = y1 + height;

    return (
      this.isCellVisited(x1, y1) ||
      this.isCellVisited(Math.min(this.mapSize.width - 1, x2), Math.min(this.mapSize.height - 1, y2))
    );
  },

  setGridMatrixOccupancy(entities: Array<Unit | Building>, matrix: Array<Array<number>>, occupancy = 1) {
    for (const entity of entities) {
      const { x, y } = entity.getRoundedPosition();
      const { width, height } = entity.size.grid;

      if (!entity.occupiesCell) continue;

      for (let xx = x; xx < x + width; xx++) {
        for (let yy = y; yy < y + height; yy++) {
          if (xx < this.mapSize.width && yy < this.mapSize.height) {
            matrix[yy][xx] += occupancy;
          }
        }
      }
    }

    return matrix;
  },

  isUnitIsInExitPoint(unit: Unit) {
    const { position } = unit;
    const terrainArea = this.getTerrainAreaByCoordinates(position);

    return !!terrainArea?.exitUrl;
  },

  getTerrainAreaByCoordinates(coordinates: GridCoordinates): TerrainArea {
    const { x, y } = coordinates;

    return this.terrain.find((terrainArea) => {
      const { x1, y1, x2, y2 } = terrainArea.target;

      return x >= x1 && x < x2 && y >= y1 && y < y2;
    })!;
  },

  isEntityInViewport(
    entity: {
      position: GridCoordinates;
      size: TileProps["size"];
    },
    viewport: GameUI["viewport"]
  ) {
    const screenPosition = gridToScreenSpace(entity.position, this.mapSize);
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

  getEntitiesWithinRadius(coordinates: GridCoordinates, entities: Array<Building | Unit>, radius: number) {
    return entities.filter((entity) => {
      const x1 = coordinates.x - radius;
      const y1 = coordinates.y - radius;
      const x2 = coordinates.x + radius;
      const y2 = coordinates.y + radius;

      const entityX = entity.position.x;
      const entityY = entity.position.y;

      return entityX >= x1 && entityX <= x2 && entityY >= y1 && entityY <= y2;
    });
  },

  screenSpaceToGridSpace(screenPos: GridCoordinates): ScreenCoordinates {
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

  convertToIsometricCoordinates(gridPos: GridCoordinates, centerOnCell = false): ScreenCoordinates {
    const shiftX = centerOnCell ? constants.wireframeTileSize.width / 2 : 0;
    const shiftY = centerOnCell ? constants.wireframeTileSize.height / 2 : 0;

    return {
      x: gridPos.x * constants.wireframeTileSize.width + shiftX,
      y: gridPos.y * constants.wireframeTileSize.height + shiftY,
    };
  },

  convertToIsometricSize(size: Size): Size {
    return {
      width: size.width * constants.wireframeTileSize.width,
      height: size.height * constants.wireframeTileSize.height,
    };
  },

  getAllAliveUnitsArray() {
    return Object.values(this.units).filter((unit) => !unit.isDead);
  },

  getAliveEnemiesArray() {
    return this.getAllAliveUnitsArray().filter((unit) => unit.id !== this.heroId);
  },

  getUnitByCoordinates(coordinates: GridCoordinates): Unit | undefined {
    return Object.values(this.units).find((unit) => {
      const unitPosition = unit.getRoundedPosition();

      return unitPosition.x === floor(coordinates.x) && unitPosition.y === floor(coordinates.y);
    });
  },

  calcUnitPath(unit: Unit, destinationPosition: GridCoordinates) {
    const unitPath = pathFinderAStar(this.matrix, unit.position, {
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

  getBuildingByCoordinates(coordinates: GridCoordinates): Building | undefined {
    return this.buildings.find(
      (building) =>
        Math.round(building.position.x) === Math.round(coordinates.x) &&
        Math.round(building.position.y) === Math.round(coordinates.y)
    );
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

  getUnitById(id: string) {
    return this.units[id];
  },

  deleteUnit(id: string) {
    const unit = this.getUnitById(id);

    this.setGridMatrixOccupancy([unit], this.matrix, -1);
    delete this.units[id];
  },

  deleteSelectedUnit() {
    if (!this.selectedUnit) return false;

    const confirmDelete = confirm(`Are you sure to delete unit #"${this.selectedUnit.id}"?`);

    if (!confirmDelete) return false;

    this.deleteUnit(this.selectedUnit.id);
    this.selectedUnit = null as unknown as Unit;

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

  deleteInventoryEntity(entity: Weapon) {
    const confirmDelete = confirm(`Are you sure to delete entity #"${entity.id}"?`);

    if (!confirmDelete) return false;

    if (entity.unit) {
      const inventoryPlaceType = entity.unit.findInventoryEntityPlaceType(entity);

      if (inventoryPlaceType) {
        entity.unit.removeItemFromInventory(entity, inventoryPlaceType);
      }

      entity.unAssignUnit();
    }

    delete this.weapon[entity.id];
  },

  deleteEntity(entityType: "terrain" | "lights", id: string) {
    const index = this[entityType].findIndex((entity) => entity.id === id);

    if (index === -1) return;

    this[entityType].splice(index, 1);
  },

  // HASH methods
  getMatrixHash() {
    return this.matrix.map((column) => column.join("")).join("");
  },

  getFogOfWarMatrixHash() {
    return this.fogOfWarMatrix.map((column) => column.join("")).join("");
  },

  getTerrainHash() {
    return this.terrain
      .map((terrainArea) => {
        return [
          `${terrainArea.source.type}`,
          `${terrainArea.source.position.x1}`,
          `${terrainArea.source.position.y1}`,
          `${terrainArea.source.position.x2}`,
          `${terrainArea.source.position.y2}`,
          `${terrainArea.target.x1}`,
          `${terrainArea.target.y1}`,
          `${terrainArea.target.x2}`,
          `${terrainArea.target.y2}`,
        ].join(":");
      })
      .join("|");
  },

  getAllAliveUnitsHash() {
    return this.getAllAliveUnitsArray()
      .map((unit) => unit.getHash())
      .join("|");
  },

  getLightsHash() {
    return this.lights.map((light) => light.getHash()).join("|");
  },

  getBuildingsHash() {
    return this.buildings.map((building) => building.getHash()).join("|");
  },

  createWeaponByClassName(weaponClass: WeaponClass, weaponType: WeaponType) {
    const weaponDict = {
      MeleeWeapon,
      Firearm,
    };

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return new weaponDict[weaponClass](weaponType, this);
  },

  createAmmoByClassName(ammoClass: AmmoClass, ammoType: AmmoType) {
    const weaponDict = {
      MeleePunch,
      FirearmAmmo,
    };

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return new weaponDict[ammoClass](ammoType, this);
  },
};
