import { GameMap } from "../../engine/GameMap";

export type StartCombatReducerAction = {
  type: "startCombat";
};
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function startCombat(state: GameMap, action: StartCombatReducerAction): GameMap {
  const allAliveEnemies = state.getAliveEnemiesArray(); // FIXME: decide which enemies take part in the battle
  const hero = state.getHero();

  hero.stop();
  hero.restoreActionPoints();

  allAliveEnemies.forEach((enemy) => {
    enemy.stop();
    enemy.restoreActionPoints();
  });

  const combatQueue: GameMap["combatQueue"] = {
    currentUnitId: hero.id,
    units: [],
  };

  return {
    ...state,
    ...{
      combatQueue,
    },
  };
}
