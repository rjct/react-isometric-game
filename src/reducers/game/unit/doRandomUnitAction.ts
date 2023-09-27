import { GameMap } from "@src/engine/gameMap";
import { randomInt } from "@src/engine/helpers";
import { Unit } from "@src/engine/unit/UnitFactory";

export type DoRandomUnitActionReducerAction = {
  type: "doRandomUnitAction";
  unit: Unit;
  deltaTime: number;
};

export function doRandomUnitAction(state: GameMap, action: DoRandomUnitActionReducerAction) {
  const randomActions = ["roam", "idle"];
  const randomAction = randomActions[randomInt(0, randomActions.length - 1)];

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  action.unit[randomAction](state);

  return state;
}
