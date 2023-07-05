import { GameMap } from "../../engine/GameMap";

export type EndTurnReducerAction = {
  type: "endTurn";
};
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function endTurn(state: GameMap, action: EndTurnReducerAction): GameMap {
  const combatQueue: GameMap["combatQueue"] = {
    currentUnitId: state.combatQueue.units[0].id,
    units: state.combatQueue.units,
  };

  const hero = state.getHero();

  hero.stop();
  hero.restoreActionPoints();

  return {
    ...state,
    ...{
      combatQueue,
    },
  };
}
