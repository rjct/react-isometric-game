import { StaticMap } from "@src/context/GameStateContext";
import { Building } from "@src/engine/building/BuildingFactory";
import { FogOfWar } from "@src/engine/FogOfWarFactory";
import { GameEntity } from "@src/engine/GameEntityFactory";
import { GameMap } from "@src/engine/gameMap";
import { createMatrix, degToRad, gridToScreesSize } from "@src/engine/helpers";
import { Light } from "@src/engine/light/LightFactory";
import { Unit } from "@src/engine/unit/UnitFactory";
import { Vehicle } from "@src/engine/vehicle/VehicleFactory";

export type SwitchGameMapReducerAction = {
  type: "switchMap";
  map: StaticMap;
  mediaFiles: MediaAssets;
};

export function switchMap(state: GameMap, action: SwitchGameMapReducerAction) {
  const globalShadows = action.map.globalShadows;
  const globalLights = action.map.globalLights;

  const newState = {
    ...state,
    ...{
      mediaAssets: action.mediaFiles,
      mapSize: action.map.size,
      isAllowedToEnterTheMapInsideVehicle: action.map.isAllowedToEnterTheMapInsideVehicle,
      matrix: createMatrix(action.map.size),
      units: {} as { [id: string]: Unit },
      buildings: [] as Building[],
      globalShadows,
      globalLights,
      lights: [] as Light[],
    },
  };

  newState.fogOfWar = new FogOfWar({ size: action.map.size });

  newState.world = new GameEntity({
    gameState: newState,
    id: "world-walls",
    size: {
      grid: { width: action.map.size.width, length: action.map.size.height, height: 1 },
      screen: gridToScreesSize(action.map.size),
    },
    position: { x: 0, y: 0 },
    rotation: 0,
    internalColor: "",
    blocksRays: true,
    occupiesCell: false,
  });

  newState.buildings = action.map.buildings.map((staticMapBuilding) => {
    const { type, position, rotation, variant, occupiesCell, inventory } = staticMapBuilding;

    const building = new Building({
      gameState: newState,
      buildingType: type,
      position,
      rotation,
      variant,
      occupiesCell: occupiesCell !== false,
    });

    if (inventory) {
      newState.createInventoryStorage(inventory, building);
    }

    building.setPosition(position, newState);

    return building;
  });

  newState.vehicles = action.map.vehicles.map((staticMapVehicle) => {
    const { id, type, position, rotation } = staticMapVehicle;
    const vehicle = new Vehicle({
      gameState: newState,
      id,
      type,
      position,
      rotation,
    });

    if (staticMapVehicle.inventory) {
      newState.createInventoryStorage(staticMapVehicle.inventory, vehicle);
    }

    vehicle.setPosition(position, newState);

    return vehicle;
  });

  newState.lights = (action.map.lights || []).map((staticMapLight) => {
    const light = new Light(staticMapLight);

    light.cast(newState.getAllGameEntitiesWalls()); //light.castRays(newState.buildings);

    return light;
  });

  newState.units = action.map.enemies.reduce((result, enemy) => {
    const unit = new Unit({
      gameState: newState,
      unitType: enemy.type!,
      position: enemy.position,
      isDead: enemy.isDead,
      action: enemy.isDead ? "dead" : "none",
      rotation: enemy.rotation,
      isHero: false,
      randomActions: enemy.randomActions,
    });

    if (enemy.inventory) {
      newState.createInventoryStorage(enemy.inventory, unit);
    }
    unit.setPosition(enemy.position, newState);

    if (newState.settings.featureEnabled.unitShadow) {
      unit.calcShadows(newState);
    }

    return { ...result, [unit.id]: unit };
  }, {});

  if (state.heroId === "") {
    const hero = new Unit({
      gameState: newState,
      unitType: "vault13_male",
      position: action.map.hero.position,
      rotation: action.map.hero.rotation,
      isHero: true,
    });

    newState.heroId = hero.id;
    newState.units[hero.id] = hero;

    if (action.map.hero.inventory) {
      newState.createInventoryStorage(action.map.hero.inventory, hero);
    }
  } else {
    newState.units[state.heroId] = state.units[state.heroId];
  }

  const heroId = newState.heroId;
  const heroRotationAngle: Angle = {
    rad: degToRad(action.map.hero.rotation || 0),
    deg: action.map.hero.rotation || 0,
  };

  newState.units[heroId].stop();
  newState.units[heroId].setPosition(action.map.hero.position, newState);
  newState.units[heroId].setRotation(heroRotationAngle);

  const hero = newState.units[heroId];

  switch (true) {
    case action.map.isAllowedToEnterTheMapInsideVehicle && hero.isVehicleInUse():
      const vehicleInUse = hero.getVehicleInUse()!;

      if (!newState.getVehicleById(vehicleInUse.id)) {
        newState.vehicles.push(vehicleInUse);
      }

      vehicleInUse.setPosition(action.map.hero.position, newState);
      vehicleInUse.setRotation(heroRotationAngle);

      break;

    case action.map.isAllowedToEnterTheMapInsideVehicle && !!action.map.hero.vehicleIdInUse:
      const vehicle = newState.getVehicleById(action.map.hero.vehicleIdInUse!);

      if (vehicle) {
        hero.getIntoVehicle(vehicle);
        hero.setRotation(vehicle.rotation, false);
        vehicle.assignDriver(hero);
      }
      break;

    default:
      newState.units[heroId].getOutOfVehicle();

      if (newState.settings.featureEnabled.unitShadow) {
        newState.units[heroId].calcShadows(newState);
      }
  }

  newState.setGridMatrixOccupancy(newState.buildings);
  newState.setGridMatrixOccupancy(newState.vehicles);
  newState.setGridMatrixOccupancy(newState.getAllAliveUnitsArray());

  return newState;
}
