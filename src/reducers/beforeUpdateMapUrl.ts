import { GameMap } from "@src/engine/gameMap";

export type BeforeUpdateMapUrlReducerAction = {
  type: "beforeUpdateMapUrl";
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function beforeUpdateMapUrl(state: GameMap, action: BeforeUpdateMapUrlReducerAction): GameMap {
  for (const vehicle of state.vehicles) {
    vehicle.stop();
  }

  return { ...state };
}
