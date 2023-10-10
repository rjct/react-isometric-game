import { GameMap } from "@src/engine/gameMap";
import { randomInt } from "@src/engine/helpers";
import { Unit } from "@src/engine/unit/UnitFactory";

export type DoRandomUnitActionReducerAction = {
  type: "doRandomUnitAction";
  unit: Unit;
  deltaTime: number;
};

export function doRandomUnitAction(state: GameMap, action: DoRandomUnitActionReducerAction) {
  if (!action.unit.isMoving()) {
    const randomActions = action.unit.randomActions;
    const randomAction = randomActions[randomInt(0, randomActions.length - 1)];

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    action.unit[randomAction](state);
  }

  action.unit.cooldown(action.deltaTime);

  return state;
}
