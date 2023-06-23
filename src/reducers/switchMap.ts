import { StaticMap, StaticMapUnit, StaticMapWeapon } from "../context/GameStateContext";
import { Building } from "../engine/BuildingFactory";
import { createMatrix } from "../engine/helpers";
import { Unit, UnitTypes } from "../engine/UnitFactory";
import { GameMap } from "../engine/GameMap";
import { TerrainArea } from "../engine/TerrainAreaFactory";
import { Light } from "../engine/LightFactory";
import { WeaponClass, WeaponType } from "../engine/weapon/WeaponFactory";
import { Firearm } from "../engine/weapon/firearm/FirearmFactory";

export type SwitchMapReducerAction = {
  type: "switchMap";
  map: StaticMap;
  mediaFiles: MediaFiles;
};

const createWeaponForUnit = (
  inventoryType: keyof Unit["inventory"],
  staticWeapon: StaticMapWeapon,
  unit: Unit,
  gameMap: GameMap
) => {
  const weapon = gameMap.createWeaponByClassName(staticWeapon.class as WeaponClass, staticWeapon.type as WeaponType);

  if (staticWeapon.ammo && weapon instanceof Firearm) {
    const ammo = staticWeapon.ammo;

    weapon.ammoCurrent = Array.from({ length: ammo.quantity }, () =>
      gameMap.createAmmoByClassName(ammo.class, ammo?.type)
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
  const buildings: Building[] = action.map.buildings.map((staticMapBuilding) => {
    const { type, position, direction, variant } = staticMapBuilding;

    const building = new Building({
      buildingType: type,
      position,
      direction,
      variant,
    });

    building.setPosition(position, action.map.size);

    return building;
  });

  const terrain: TerrainArea[] = action.map.terrain.map((terrainArea) => {
    return new TerrainArea(terrainArea);
  });

  const shadows = action.map.shadows;

  const lights = (action.map.lights || []).map((staticMapLight) => {
    const light = new Light(staticMapLight);

    light.castRays(buildings);

    return light;
  });

  const newState = {
    ...state,
    ...{
      mediaFiles: action.mediaFiles,
      mapSize: action.map.size,
      terrain: terrain, //action.map.terrain,
      matrix: createMatrix(action.map.size),
      fogOfWarMatrix: createMatrix(action.map.size),
      units: {} as UnitTypes,
      buildings,
      shadows,
      lights,
    },
  };

  newState.units = action.map.enemies.reduce((result, enemy) => {
    const unit = new Unit({ unitType: enemy.type!, position: enemy.position });
    unit.setPosition(unit.position, newState.mapSize);
    unit.calcShadows(newState);

    createUnitInventory(enemy.inventory, unit, newState);

    return { ...result, [unit.id]: unit };
  }, {});

  if (state.heroId === "") {
    const hero = new Unit({ unitType: "vault13_male", position: action.map.hero.position });

    newState.heroId = hero.id;
    newState.units[hero.id] = hero;

    createUnitInventory(action.map.hero.inventory, hero, newState);
  } else {
    newState.units[state.heroId] = state.units[state.heroId];
  }

  const heroId = newState.heroId;

  newState.units[heroId].stop();
  newState.units[heroId].setPosition(action.map.hero.position, newState.mapSize);
  newState.units[heroId].calcShadows(newState);

  newState.setVisitedCell(newState.units[newState.heroId].position);

  newState.matrix = newState.setGridMatrixOccupancy(buildings, newState.matrix);
  newState.matrix = newState.setGridMatrixOccupancy(Object.values(newState.units), newState.matrix);

  Object.values(newState.units).forEach((unit) => {
    unit.getInventoryItems().forEach((item) => {
      newState.weapon[item.id] = item;
      item.updateReferenceToGameMap(newState);
    });
  });

  return newState;
}
