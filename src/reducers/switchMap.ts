import { StaticMap } from "@src/context/GameStateContext";
import { Building } from "@src/engine/BuildingFactory";
import { GameMap } from "@src/engine/gameMap";
import { GameObjectFactory } from "@src/engine/GameObjectFactory";
import { createMatrix, gridToScreesSize } from "@src/engine/helpers";
import { Light } from "@src/engine/light/LightFactory";
import { Unit, UnitTypes } from "@src/engine/unit/UnitFactory";

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
      fogOfWarMatrix: createMatrix(action.map.size),
      units: {} as UnitTypes,
      buildings: [] as Building[],
      globalShadows,
      globalLights,
      lights: [] as Light[],
    },
  };

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
    const { type, position, direction, variant, occupiesCell, inventory } = staticMapBuilding;

    const building = new Building({
      gameState: newState,
      buildingType: type,
      position,
      direction,
      variant,
      occupiesCell: occupiesCell !== false,
      inventory,
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
      inventory: enemy.inventory,
      isHero: false,
    });
    unit.setPosition(unit.position, newState);

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
      direction: action.map.hero.direction,
      inventory: action.map.hero.inventory,
      isHero: true,
    });

    newState.heroId = hero.id;
    newState.units[hero.id] = hero;
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

  return newState;
}
