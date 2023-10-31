import { StaticMap } from "@src/context/GameStateContext";
import { Building } from "@src/engine/BuildingFactory";
import { FogOfWar } from "@src/engine/FogOfWarFactory";
import { GameEntity } from "@src/engine/GameEntityFactory";
import { GameMap } from "@src/engine/gameMap";
import { createMatrix, gridToScreesSize } from "@src/engine/helpers";
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
      inventory,
    });

    building.setPosition(position, newState);

    return building;
  });

  newState.vehicles = action.map.vehicles.map((staticMapVehicle) => {
    const { type, position, rotation } = staticMapVehicle;
    const vehicle = new Vehicle({
      gameState: newState,
      type,
      position,
      rotation,
    });

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
      inventory: enemy.inventory,
      isHero: false,
      healthPoints: enemy.healthPoints,
      randomActions: enemy.randomActions,
    });
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
      inventory: action.map.hero.inventory,
      isHero: true,
    });

    newState.heroId = hero.id;
    newState.units[hero.id] = hero;
  } else {
    newState.units[state.heroId] = state.units[state.heroId];
  }

  const heroId = newState.heroId;

  newState.units[heroId].getOutOfVehicle();
  newState.units[heroId].stop();
  newState.units[heroId].setPosition(action.map.hero.position, newState);

  if (newState.settings.featureEnabled.unitShadow) {
    newState.units[heroId].calcShadows(newState);
  }

  newState.setGridMatrixOccupancy(newState.buildings);
  newState.setGridMatrixOccupancy(newState.vehicles);
  newState.setGridMatrixOccupancy(newState.getAllAliveUnitsArray());

  return newState;
}
