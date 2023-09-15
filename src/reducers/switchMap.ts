import { StaticMap, StaticMapUnit, StaticMapWeapon } from "@src/context/GameStateContext";
import { Building } from "@src/engine/BuildingFactory";
import { GameMap } from "@src/engine/GameMap";
import { GameObjectFactory } from "@src/engine/GameObjectFactory";
import { createMatrix, gridToScreesSize } from "@src/engine/helpers";
import { Light } from "@src/engine/LightFactory";
import { TerrainArea } from "@src/engine/TerrainAreaFactory";
import { Unit, UnitTypes } from "@src/engine/UnitFactory";
import { Firearm } from "@src/engine/weapon/firearm/FirearmFactory";
import { WeaponClass, WeaponType } from "@src/engine/weapon/WeaponFactory";

export type SwitchMapReducerAction = {
  type: "switchMap";
  map: StaticMap;
  mediaFiles: MediaAssets;
};

const createWeaponForUnit = (
  inventoryType: keyof Unit["inventory"],
  staticWeapon: StaticMapWeapon,
  unit: Unit,
  gameMap: GameMap,
) => {
  const weapon = gameMap.createWeaponByClassName(staticWeapon.class as WeaponClass, staticWeapon.type as WeaponType);

  if (staticWeapon.ammo && weapon instanceof Firearm) {
    const ammo = staticWeapon.ammo;

    weapon.ammoCurrent = Array.from({ length: ammo.quantity }, () =>
      gameMap.createAmmoByClassName(ammo.class, ammo?.type),
    );
  }

  weapon.assignUnit(unit);

  unit.putItemToInventory(weapon, inventoryType);
};

const createUnitInventory = (inventory: StaticMapUnit["inventory"], unit: Unit, gameMap: GameMap) => {
  if (!inventory) return;

  Object.entries(inventory).forEach(([inventoryType, staticWeapon]) => {
    if (Array.isArray(staticWeapon)) {
      staticWeapon.forEach((iter) => {
        createWeaponForUnit(inventoryType as keyof Unit["inventory"], iter, unit, gameMap);
      });
    } else {
      createWeaponForUnit(inventoryType as keyof Unit["inventory"], staticWeapon, unit, gameMap);
    }
  });
};

export function switchMap(state: GameMap, action: SwitchMapReducerAction) {
  const globalShadows = action.map.globalShadows;
  const globalLights = action.map.globalLights;

  const newState = {
    ...state,
    ...{
      mediaAssets: action.mediaFiles,
      mapSize: action.map.size,
      terrain: [] as GameMap["terrain"],
      matrix: createMatrix(action.map.size),
      fogOfWarMatrix: createMatrix(action.map.size),
      units: {} as UnitTypes,
      buildings: [] as Building[],
      globalShadows,
      globalLights,
      lights: [] as Light[],
    },
  };

  newState.terrain = action.map.terrain.map((terrainArea) => {
    return new TerrainArea(terrainArea, newState.mapSize);
  });

  newState.world = new GameObjectFactory({
    gameState: newState,
    id: "world-walls",
    size: {
      grid: { width: action.map.size.width, length: action.map.size.height, height: 1 },
      screen: gridToScreesSize(action.map.size),
    },
    position: { x: 0, y: 0 },
    direction: "left",
    internalColor: "",
    occupiesCell: false,
  });

  newState.buildings = action.map.buildings.map((staticMapBuilding) => {
    const { type, position, direction, variant, occupiesCell } = staticMapBuilding;

    const building = new Building({
      gameState: newState,
      buildingType: type,
      position,
      direction,
      variant,
      occupiesCell: occupiesCell !== false,
    });

    building.setPosition(position, newState);

    return building;
  });

  newState.lights = (action.map.lights || []).map((staticMapLight) => {
    const light = new Light(staticMapLight);

    light.cast(newState.getAllGameObjectsWalls()); //light.castRays(newState.buildings);

    return light;
  });

  newState.units = action.map.enemies.reduce((result, enemy) => {
    const unit = new Unit({
      gameState: newState,
      unitType: enemy.type!,
      position: enemy.position,
      isDead: enemy.isDead,
      action: enemy.isDead ? "dead" : "none",
      direction: enemy.direction,
      isHero: false,
    });
    unit.setPosition(unit.position, newState);

    if (newState.settings.featureEnabled.unitShadow) {
      unit.calcShadows(newState);
    }

    createUnitInventory(enemy.inventory, unit, newState);

    return { ...result, [unit.id]: unit };
  }, {});

  if (state.heroId === "") {
    const hero = new Unit({
      gameState: newState,
      unitType: "vault13_male",
      position: action.map.hero.position,
      direction: action.map.hero.direction,
      isHero: true,
    });

    newState.heroId = hero.id;
    newState.units[hero.id] = hero;

    createUnitInventory(action.map.hero.inventory, hero, newState);
  } else {
    newState.units[state.heroId] = state.units[state.heroId];
  }

  const heroId = newState.heroId;

  newState.units[heroId].stop();
  newState.units[heroId].setPosition(action.map.hero.position, newState);

  if (newState.settings.featureEnabled.unitShadow) {
    newState.units[heroId].calcShadows(newState);
  }

  newState.setVisitedCell(newState.units[newState.heroId].position);

  newState.matrix = newState.setGridMatrixOccupancy(newState.buildings, newState.matrix);
  newState.matrix = newState.setGridMatrixOccupancy(newState.getAllAliveUnitsArray(), newState.matrix);

  Object.values(newState.units).forEach((unit) => {
    unit.getInventoryItems().forEach((item) => {
      newState.weapon[item.id] = item;
      item.updateReferenceToGameMap(newState);
    });
  });

  return newState;
}
