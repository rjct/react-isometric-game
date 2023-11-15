import { StaticMapInventory, StaticMapWeapon, StaticMapWeaponAmmo } from "@src/context/GameStateContext";
import { GameUI } from "@src/context/GameUIContext";
import { AmmoDictEntity } from "@src/dict/ammo/ammo";
import { WeaponDictEntity } from "@src/dict/weapon/weapon";
import { Building } from "@src/engine/building/BuildingFactory";
import { constants, GameDebugFeature, GameFeatureSections, GameSettingsFeature } from "@src/engine/constants";
import { FogOfWar } from "@src/engine/FogOfWarFactory";
import { GameEntity } from "@src/engine/GameEntityFactory";
import { floor, getDistanceBetweenGridPoints, randomInt } from "@src/engine/helpers";
import { Light } from "@src/engine/light/LightFactory";
import { MovableGameEntity } from "@src/engine/MovableGameEntityFactory";
import { TerrainArea, TerrainTile } from "@src/engine/terrain/TerrainAreaFactory";
import { TerrainCluster } from "@src/engine/terrain/TerrainClusterFactory";
import { pathFinderAStar } from "@src/engine/unit/pathFinder";
import { Unit } from "@src/engine/unit/UnitFactory";
import { Vehicle } from "@src/engine/vehicle/VehicleFactory";
import { Vfx } from "@src/engine/vfx/VfxFactory";
import { Ammo } from "@src/engine/weapon/AmmoFactory";
import { createInventoryItemByName } from "@src/engine/weapon/helpers";
import { Weapon } from "@src/engine/weapon/WeaponFactory";
import { getUrlParamValue } from "@src/hooks/useUrl";

interface GameMapProps {
  mapSize: Size2D;
  terrain: {
    areas: TerrainArea[];
    clusters: TerrainCluster[];
  };
  buildings: Building[];
  vehicles: Vehicle[];
  units: { [id: string]: Unit };
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

  world: null as unknown as GameEntity,

  buildings: [] as GameMapProps["buildings"],
  vehicles: [] as GameMapProps["vehicles"],
  heroId: "",
  units: {} as GameMapProps["units"],
  lights: [] as GameMapProps["lights"],
  weapon: {} as GameMapProps["weapon"],
  ammo: {} as GameMapProps["ammo"],
  ammoFiredIds: [] as Array<Ammo["id"]>,

  matrix: [] as Array<Array<number>>,
  mediaAssets: {} as MediaAssets,

  fogOfWar: null as unknown as FogOfWar,

  selectedEntityForInventoryTransfer: null as unknown as Unit | Building | Vehicle | null,
  highlightedEntityForInventoryTransfer: null as unknown as Unit | Building | Vehicle | null,

  selectedInventoryItem: null as unknown as WeaponDictEntity | AmmoDictEntity | null,

  selectedBuilding: null as unknown as Building,
  selectedVehicle: null as unknown as Vehicle,
  selectedUnit: null as unknown as Unit,
  selectedLight: null as unknown as Light,
  entityPlaceholder: null as unknown as {
    position: GridCoordinates;
    size: Size3D;
    rotation: AngleInDegrees;
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

  createSfx(src: string[], volume = 1, stereoPan = 0) {
    if (volume <= 0 || src.length === 0) return null;

    const decodedTrack = this.getAssetAudio(src[randomInt(0, src.length - 1)]);
    const gainNode = this.audioContext.createGain();
    const panNode = new StereoPannerNode(this.audioContext);

    gainNode.gain.value = volume;
    panNode.pan.value = stereoPan;

    if (decodedTrack) {
      const bufferSource = this.audioContext.createBufferSource();

      bufferSource.buffer = decodedTrack.source;
      bufferSource.connect(panNode).connect(gainNode).connect(this.audioContext.destination);

      return bufferSource;
    }

    return null;
  },

  playSfx(src: string[], volume = 1, stereoPan = 0) {
    if (volume <= 0 || src.length === 0) return;

    const bufferSource = this.createSfx(src, volume, stereoPan);

    if (bufferSource) {
      bufferSource.start();
    }
  },

  occupyCell(coordinates: GridCoordinates) {
    this.matrix[Math.round(coordinates.y)][Math.round(coordinates.x)]++;
  },

  deOccupyCell(coordinates: GridCoordinates) {
    const value = this.matrix[Math.round(coordinates.y)][Math.round(coordinates.x)];

    this.matrix[Math.round(coordinates.y)][Math.round(coordinates.x)] = Math.max(0, value - 1);
  },

  occupyArea(coordinates: GridCoordinates, size: Size3D) {
    const { x, y } = coordinates;
    const { width, length } = size;

    for (let xx = x; xx < x + width; xx++) {
      for (let yy = y; yy < y + length; yy++) {
        this.occupyCell({ x: xx, y: yy });
      }
    }
  },

  deOccupyArea(coordinates: GridCoordinates, size: Size3D) {
    const { x, y } = coordinates;
    const { width, length } = size;

    for (let xx = x; xx < x + width; xx++) {
      for (let yy = y; yy < y + length; yy++) {
        this.deOccupyCell({ x: xx, y: yy });
      }
    }
  },

  isCellOccupied(coordinates: GridCoordinates) {
    const x = Math.min(this.mapSize.width - 1, Math.max(0, Math.round(coordinates.x)));
    const y = Math.min(this.mapSize.height - 1, Math.max(0, Math.round(coordinates.y)));

    return this.matrix[y][x] > 0;
  },

  checkCollision(entity: MovableGameEntity): boolean {
    const TOLERANCE = 0.1;
    const { position, size } = entity;
    const { x, y } = position.grid;
    const { width, length } = size.grid;

    for (let i = x - TOLERANCE; i < x + width + TOLERANCE; i++) {
      for (let j = y - TOLERANCE; j < y + length + TOLERANCE; j++) {
        if (this.isCellOccupied({ x: i, y: j }) && !(i >= x + width || j >= y + length || i + 1 <= x || j + 1 <= y)) {
          return true;
        }
      }
    }

    return false;
  },

  isEntityVisibleByHero(entity: Building | Unit | Vehicle) {
    if (!this.settings.featureEnabled.fogOfWar || entity.id === this.heroId) return true;

    return this.getHero().fieldOfView.isEntityInView(entity);
  },

  setGridMatrixOccupancy(entities: Array<Unit | Building | Vehicle>, occupancy = 1) {
    for (const entity of entities) {
      if (!entity.occupiesCell) continue;

      const { x, y } = entity.getRoundedPosition();
      const { width, length } = entity.size.grid;

      for (let xx = x; xx < x + width; xx++) {
        for (let yy = y; yy < y + length; yy++) {
          if (xx < this.mapSize.width && yy < this.mapSize.height) {
            this.matrix[yy][xx] = Math.max(0, this.matrix[yy][xx] + occupancy);
          }
        }
      }
    }
  },

  isEntityInViewport(entity: TerrainTile | Unit | Building | Vehicle, viewport: GameUI["viewport"]) {
    return !!viewport.visibleCells[`${floor(entity.position.grid.x)}:${floor(entity.position.grid.y)}`];
  },

  getEntitiesWithinRadius(coordinates: GridCoordinates, entities: Array<Building | Unit | Vehicle>, radius: number) {
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

  getAllUnblockedCellsAroundEntity(entity: GameEntity) {
    const cells: GridCoordinates[] = [];

    for (let x = entity.position.grid.x - 1; x < entity.position.grid.x + entity.size.grid.width + 1; x++) {
      for (let y = entity.position.grid.y - 1; y < entity.position.grid.y + entity.size.grid.length + 1; y++) {
        if (!this.isCellOccupied({ x, y })) {
          cells.push({ x, y });
        }
      }
    }

    return cells;
  },

  getClosestCoordinatesToEntity(entity: GameEntity, targetEntity: GameEntity) {
    const roundedPosition = entity.getRoundedPosition();

    const allUnblockedCellsAroundEntity = this.getAllUnblockedCellsAroundEntity(targetEntity)
      .filter((coordinates) => {
        return this.calcMovementPath(entity.position.grid, coordinates).length > 0;
      })
      .sort((a: GridCoordinates, b: GridCoordinates) => {
        return getDistanceBetweenGridPoints(roundedPosition, a) - getDistanceBetweenGridPoints(roundedPosition, b);
      });

    return allUnblockedCellsAroundEntity[0];
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
    const units = this.getAllUnitsArray();

    for (const unit of units) {
      const unitPosition = unit.getRoundedPosition();

      if (unitPosition.x === floor(coordinates.x) && unitPosition.y === floor(coordinates.y)) {
        return unit;
      }
    }
  },

  getEntityByCoordinates(coordinates: GridCoordinates): Unit | Building | Vehicle | undefined {
    return (
      this.getUnitByCoordinates(coordinates) ||
      this.getBuildingByCoordinates(coordinates) ||
      this.getVehicleByCoordinates(coordinates)
    );
  },

  calcMovementPath(startPosition: GridCoordinates, destinationPosition: GridCoordinates) {
    const path = pathFinderAStar(this.matrix, startPosition, {
      x: Math.min(this.mapSize.width - 1, destinationPosition.x),
      y: Math.min(this.mapSize.height - 1, destinationPosition.y),
    });

    if (path.length > 0) {
      if (startPosition.x !== path[0][0] || startPosition.y !== path[0][1]) {
        path.splice(0, 1, [startPosition.x, startPosition.y]);
      }
    }

    return path;
  },

  getBuildingById(id: string) {
    return this.buildings.find((building) => building.id === id);
  },

  getVehicleById(id: string) {
    return this.vehicles.find((vehicle) => vehicle.id === id);
  },

  getBuildingByCoordinates(coordinates: GridCoordinates): Building | undefined {
    const { x, y } = coordinates;

    for (const building of this.buildings) {
      if (
        x >= Math.round(building.position.grid.x) &&
        x < Math.round(building.position.grid.x + building.size.grid.width) &&
        y >= Math.round(building.position.grid.y) &&
        y < Math.round(building.position.grid.y + building.size.grid.length)
      ) {
        return building;
      }
    }
  },

  getVehicleByCoordinates(coordinates: GridCoordinates) {
    const { x, y } = coordinates;

    for (const vehicle of this.vehicles) {
      if (
        x >= Math.round(vehicle.position.grid.x) &&
        x < Math.round(vehicle.position.grid.x + vehicle.size.grid.width) &&
        y >= Math.round(vehicle.position.grid.y) &&
        y < Math.round(vehicle.position.grid.y + vehicle.size.grid.length)
      ) {
        return vehicle;
      }
    }
  },

  deleteBuilding(id: string) {
    const index = this.buildings.findIndex((entity) => entity.id === id);

    if (index === -1) return;

    this.setGridMatrixOccupancy([this.buildings[index]], -1);
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

  deleteVehicle(id: string) {
    const index = this.vehicles.findIndex((entity) => entity.id === id);

    if (index === -1) return;

    this.setGridMatrixOccupancy([this.vehicles[index]], -1);
    this.vehicles.splice(index, 1);
  },

  deleteSelectedVehicle() {
    if (!this.selectedVehicle) return false;

    const confirmDelete = confirm(`Are you sure to delete vehicle #"${this.selectedBuilding.id}"?`);

    if (!confirmDelete) return false;

    this.deleteVehicle(this.selectedVehicle.id);
    this.selectedVehicle = null as unknown as Vehicle;

    return true;
  },

  getUnitById(id: string) {
    return this.units[id];
  },

  deleteUnit(id: string) {
    const unit = this.getUnitById(id);

    this.setGridMatrixOccupancy([unit], -1);
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

  createInventoryItem(
    owner: Building | Unit | Vehicle,
    inventoryType: keyof StaticMapInventory,
    staticMapItem: StaticMapWeapon | StaticMapWeaponAmmo,
  ) {
    const inventoryItems = Array.from({ length: staticMapItem.quantity || 1 }, () =>
      createInventoryItemByName(staticMapItem.name),
    );

    inventoryItems.forEach((iter) => {
      owner.putItemToInventory(iter, inventoryType);

      if (iter instanceof Weapon) {
        this.weapon[iter.id] = iter;
      } else if (iter instanceof Ammo) {
        this.ammo[iter.id] = iter;
      }
    });

    return inventoryItems;
  },

  createInventoryStorage(inventory: StaticMapInventory, owner: Building | Unit | Vehicle) {
    if (!inventory) return;

    Object.entries(inventory).forEach(([inventoryType, staticEntity]) => {
      if (Array.isArray(staticEntity)) {
        staticEntity.forEach((iter) => {
          this.createInventoryItem(owner, inventoryType as keyof StaticMapInventory, iter).forEach((item) => {
            item.assignOwner(owner);
          });
        });
      } else {
        this.createInventoryItem(owner, inventoryType as keyof StaticMapInventory, staticEntity).forEach((item) => {
          item.assignOwner(owner);
        });
      }
    });
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

  getVehiclesHash() {
    return this.vehicles.map((vehicle) => vehicle.getHash()).join("|");
  },

  getAllGameEntitiesWalls() {
    return [
      ...this.world.walls,
      ...this.buildings
        .filter((entity) => entity.blocksRays)
        .map((entity) => entity.walls)
        .flat(),
      ...this.vehicles
        .filter((entity) => entity.blocksRays)
        .map((entity) => entity.walls)
        .flat(),
    ];
  },
};
