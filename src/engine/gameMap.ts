import { GameUI } from "@src/context/GameUIContext";
import { AmmoDictEntity } from "@src/dict/ammo/ammo";
import { WeaponDictEntity } from "@src/dict/weapon/weapon";
import { Building } from "@src/engine/BuildingFactory";
import { constants, GameDebugFeature, GameFeatureSections, GameSettingsFeature } from "@src/engine/constants";
import { FogOfWar } from "@src/engine/FogOfWarFactory";
import { GameObject } from "@src/engine/GameObjectFactory";
import { floor, randomInt } from "@src/engine/helpers";
import { Light } from "@src/engine/light/LightFactory";
import { TerrainArea, TerrainTile } from "@src/engine/terrain/TerrainAreaFactory";
import { TerrainCluster } from "@src/engine/terrain/TerrainClusterFactory";
import { pathFinderBiAStar } from "@src/engine/unit/pathFinder";
import { Unit, UnitTypes } from "@src/engine/unit/UnitFactory";
import { Vfx } from "@src/engine/vfx/VfxFactory";
import { Ammo } from "@src/engine/weapon/AmmoFactory";
import { Weapon } from "@src/engine/weapon/WeaponFactory";
import { getUrlParamValue } from "@src/hooks/useUrl";

interface GameMapProps {
  mapSize: Size2D;
  terrain: {
    areas: TerrainArea[];
    clusters: TerrainCluster[];
  };
  buildings: Building[];
  units: UnitTypes;
  lights: Light[];
  weapon: { [id: string]: Weapon };
  ammo: { [id: string]: Ammo };
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
      skipIntro: isFeatureEnabled("debug", "skipIntro"),
      wireframe: isFeatureEnabled("debug", "wireframe"),
      buildingBoxes: isFeatureEnabled("debug", "buildingBoxes"),
      occupiedCells: isFeatureEnabled("debug", "occupiedCells"),
      unitPath: isFeatureEnabled("debug", "unitPath"),
      unitFieldOfView: isFeatureEnabled("debug", "unitFieldOfView"),
      unitShadowVectors: isFeatureEnabled("debug", "unitShadowVectors"),
      unitInfo: isFeatureEnabled("debug", "unitInfo"),
    },
  },

  globalShadows: {
    color: "",
    opacity: 0,
  },

  globalLights: {
    opacity: 0,
  },

  mapUrl: constants.STARTING_MAP,

  mapSize: {
    width: 0,
    height: 0,
  } as GameMapProps["mapSize"],

  world: null as unknown as GameObject,

  buildings: [] as GameMapProps["buildings"],
  heroId: "",
  units: {} as GameMapProps["units"],
  lights: [] as GameMapProps["lights"],
  weapon: {} as GameMapProps["weapon"],
  ammo: {} as GameMapProps["ammo"],
  ammoFiredIds: [] as Array<Ammo["id"]>,

  matrix: [] as Array<Array<number>>,
  mediaAssets: {} as MediaAssets,

  fogOfWar: null as unknown as FogOfWar,

  selectedEntityForInventoryTransfer: null as unknown as Unit | Building | null,
  highlightedEntityForInventoryTransfer: null as unknown as Unit | Building | null,

  selectedInventoryItem: null as unknown as WeaponDictEntity | AmmoDictEntity | null,

  selectedBuilding: null as unknown as Building,
  selectedUnit: null as unknown as Unit,
  selectedLight: null as unknown as Light,
  entityPlaceholder: null as unknown as {
    position: GridCoordinates;
    size: Size3D;
    direction: Direction;
  } | null,

  combatQueue: {
    currentUnitId: null as unknown as string | null,
    units: [] as Array<Unit>,
  },

  audioContext: new AudioContext(),
  visualEffects: [] as Array<Vfx>,

  getHero() {
    return this.units[this.heroId];
  },

  getAssetImage(assetName: string): AssetFileImage | null {
    if (!this.mediaAssets.image[assetName]) return null;

    return this.mediaAssets.image[assetName] as AssetFileImage;
  },

  getAssetAudio(assetName: string): AssetFileAudio | null {
    if (!this.mediaAssets.audio[assetName]) return null;

    return this.mediaAssets.audio[assetName] as AssetFileAudio;
  },

  playSfx(src: string[], volume = 1, stereoPan = 0) {
    if (volume <= 0 || src.length === 0) return;

    const decodedTrack = this.getAssetAudio(src[randomInt(0, src.length - 1)]);
    const gainNode = this.audioContext.createGain();
    const panNode = new StereoPannerNode(this.audioContext);

    gainNode.gain.value = volume;
    panNode.pan.value = stereoPan;

    if (decodedTrack) {
      const bufferSource = this.audioContext.createBufferSource();

      bufferSource.buffer = decodedTrack.source;
      bufferSource.connect(panNode).connect(gainNode).connect(this.audioContext.destination);

      bufferSource.start();
    } else {
      throw Error(`Can't find SFX "${src}"`);
    }
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

  isEntityVisibleByHero(entity: Building | Unit) {
    if (!this.settings.featureEnabled.fogOfWar || entity.id === this.heroId) return true;

    return this.getHero().fieldOfView.isEntityInView(entity.id);
  },

  setGridMatrixOccupancy(entities: Array<Unit | Building>, matrix: Array<Array<number>>, occupancy = 1) {
    for (const entity of entities) {
      if (!entity.occupiesCell) continue;

      const { x, y } = entity.getRoundedPosition();
      const { width, length } = entity.size.grid;

      for (let xx = x; xx < x + width; xx++) {
        for (let yy = y; yy < y + length; yy++) {
          if (xx < this.mapSize.width && yy < this.mapSize.height) {
            matrix[yy][xx] += occupancy;
          }
        }
      }
    }

    return matrix;
  },

  isEntityInViewport(entity: TerrainTile | Unit | Building, viewport: GameUI["viewport"]) {
    return !!viewport.visibleCells[`${floor(entity.position.grid.x)}:${floor(entity.position.grid.y)}`];
  },

  getEntitiesWithinRadius(coordinates: GridCoordinates, entities: Array<Building | Unit>, radius: number) {
    return entities.filter((entity) => {
      const x1 = coordinates.x - radius;
      const y1 = coordinates.y - radius;
      const x2 = coordinates.x + radius;
      const y2 = coordinates.y + radius;

      const entityX = entity.position.grid.x;
      const entityY = entity.position.grid.y;

      return entityX >= x1 && entityX <= x2 && entityY >= y1 && entityY <= y2;
    });
  },

  convertToIsometricCoordinates(gridPos: GridCoordinates, centerOnCell = false): ScreenCoordinates {
    const shiftX = centerOnCell ? constants.wireframeTileSize.width / 2 : 0;
    const shiftY = centerOnCell ? constants.wireframeTileSize.height / 2 : 0;

    return {
      x: gridPos.x * constants.wireframeTileSize.width + shiftX,
      y: gridPos.y * constants.wireframeTileSize.height + shiftY,
    };
  },

  convertToIsometricSize(size: Size2D): Size2D {
    return {
      width: size.width * constants.wireframeTileSize.width,
      height: size.height * constants.wireframeTileSize.height,
    };
  },

  getAllUnitsArray() {
    return Object.values(this.units);
  },

  getAllAliveUnitsArray() {
    return this.getAllUnitsArray().filter((unit) => !unit.isDead);
  },

  getAliveEnemiesArray() {
    return this.getAllAliveUnitsArray().filter((unit) => unit.id !== this.heroId);
  },

  getAllEnemiesArray() {
    return this.getAllUnitsArray().filter((unit) => unit.id !== this.heroId);
  },

  getUnitByCoordinates(coordinates: GridCoordinates): Unit | undefined {
    return this.getAllUnitsArray().find((unit) => {
      const unitPosition = unit.getRoundedPosition();

      return unitPosition.x === floor(coordinates.x) && unitPosition.y === floor(coordinates.y);
    });
  },

  getEntityByCoordinates(coordinates: GridCoordinates): Unit | Building | undefined {
    return this.getUnitByCoordinates(coordinates) || this.getBuildingByCoordinates(coordinates);
  },

  calcUnitPath(unit: Unit, destinationPosition: GridCoordinates) {
    const unitPath = pathFinderBiAStar(this.matrix, unit.position.grid, {
      x: Math.min(this.mapSize.width - 1, destinationPosition.x),
      y: Math.min(this.mapSize.height - 1, destinationPosition.y),
    });

    if (unitPath.length > 0) {
      if (unit.position.grid.x !== unitPath[0][0] || unit.position.grid.y !== unitPath[0][1]) {
        unitPath.splice(0, 1, [unit.position.grid.x, unit.position.grid.y]);
      }
    }

    return unitPath;
  },

  getBuildingById(id: string) {
    return this.buildings.find((building) => building.id === id);
  },

  getBuildingByCoordinates(coordinates: GridCoordinates): Building | undefined {
    const { x, y } = coordinates;

    return this.buildings.find(
      (building) =>
        x >= Math.round(building.position.grid.x) &&
        x < Math.round(building.position.grid.x + building.size.grid.width) &&
        y >= Math.round(building.position.grid.y) &&
        y < Math.round(building.position.grid.y + building.size.grid.length),
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

  getLightById(id: string) {
    return this.lights.find((light) => light.id === id);
  },

  deleteSelectedLight() {
    if (!this.selectedLight) return false;

    const confirmDelete = confirm(`Are you sure to delete light #"${this.selectedLight.id}"?`);

    if (!confirmDelete) return false;

    this.deleteLight(this.selectedLight.id);
    this.selectedLight = null as unknown as Light;

    return true;
  },

  deleteInventoryItem(item: Weapon | Ammo) {
    const confirmDelete = confirm(`Are you sure to delete entity #"${item.id}"?`);

    if (!confirmDelete) return false;

    if (item.owner) {
      const inventoryPlaceType = item.owner.findInventoryEntityPlaceType(item);

      if (inventoryPlaceType) {
        item.owner.removeItemFromInventory(item, inventoryPlaceType);
      }

      item.unAssignOwner();
    }

    delete this.weapon[item.id];
  },

  deleteLight(id: string) {
    const index = this.lights.findIndex((entity) => entity.id === id);

    if (index === -1) return;

    this.lights.splice(index, 1);
  },

  getItemById(id: string): Weapon | Ammo | undefined {
    return this.weapon[id] || this.getAmmoById(id);
  },

  getAmmoById(id: string): Ammo | undefined {
    return this.ammo[id];
  },

  // HASH methods
  getMatrixHash() {
    return this.matrix.map((column) => column.join("")).join("");
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

  getAllGameObjectsWalls() {
    return [
      ...this.world.walls,
      ...this.buildings
        .filter((building) => building.occupiesCell)
        .map((building) => building.walls)
        .flat(),
    ];
  },
};
