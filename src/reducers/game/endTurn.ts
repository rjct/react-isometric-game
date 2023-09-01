import { GameMap } from "@src/engine/GameMap";

export type EndTurnReducerAction = {
  type: "endTurn";
};
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function endTurn(state: GameMap, action: EndTurnReducerAction): GameMap {
  const combatQueue: GameMap["combatQueue"] = {
    currentUnitId: state.combatQueue.units[0].id,
    units: state.combatQueue.units,
  };

  return {
    ...state,
    ...{
      combatQueue,
    },
  };
}
