import { GameMap } from "../../engine/GameMap";

export type EndCombatReducerAction = {
  type: "endCombat";
};
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function endCombat(state: GameMap, action: EndCombatReducerAction): GameMap {
  const allAliveEnemies = state.getAliveEnemiesArray();

  allAliveEnemies.forEach((enemy) => {
    enemy.stop();
  });

  const combatQueue: GameMap["combatQueue"] = {
    currentUnitId: null,
    units: [],
  };

  return {
    ...state,
    ...{
      combatQueue,
    },
  };
}
