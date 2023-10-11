import { GameMap } from "@src/engine/gameMap";

export type DeleteVfxReducerAction = {
  type: "deleteVfx";
  id: string;
};

export function deleteVfx(state: GameMap, action: DeleteVfxReducerAction): GameMap {
  state.visualEffects = [...state.visualEffects.filter((vfx) => vfx.id !== action.id)];

  return { ...state };
}
