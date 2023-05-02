import { StaticMap } from "../context/GameStateContext";
import { Building } from "../engine/BuildingFactory";
import { createMatrix } from "../engine/helpers";
import { Unit, UnitTypes } from "../engine/UnitFactory";
import { GameMap } from "../engine/GameMap";

export type SwitchMapReducerAction = {
  type: "switchMap";
  map: StaticMap;
};

export function switchMap(state: GameMap, action: SwitchMapReducerAction) {
  const heroId = state.heroId;

  const buildings: Building[] = action.map.buildings.map((building) => {
    const { type, position, direction, variant } = building;

    return new Building({
      buildingType: type,
      position,
      direction,
      variant,
    });
  });

  const enemies: UnitTypes = action.map.enemies.reduce((result, enemy) => {
    const unit = new Unit({ unitType: enemy.type, position: enemy.position });

    return { ...result, [unit.id]: unit };
  }, {});

  const newState = {
    ...state,
    ...{
      mapSize: action.map.size,
      terrain: action.map.terrain,
      matrix: createMatrix(action.map.size),
      fogOfWarMatrix: createMatrix(action.map.size),
      units: {
        ...{ [state.units[heroId].id]: state.units[heroId] },
        ...enemies,
      },
      buildings,
    },
  };

  newState.tiles = newState.createTiles(action.map);
  newState.wireframe = newState.createWireframe(action.map.size);

  newState.units[heroId].setAction("none");
  newState.units[heroId].clearPath();
  newState.units[heroId].setPosition(action.map.heroStartPosition);

  newState.setVisitedCell(newState.units[newState.heroId].position);

  newState.matrix = newState.setGridMatrixOccupancy(buildings, newState.matrix);
  newState.matrix = newState.setGridMatrixOccupancy(Object.values(newState.units), newState.matrix);

  action.map.exitPoints.forEach((exitPoint) => {
    newState.setWireframeMatrixExitPoints(exitPoint);
  });

  return newState;
}
