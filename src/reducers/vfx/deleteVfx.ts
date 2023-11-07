import { GameMap } from "@src/engine/gameMap";

export type DeleteVfxReducerAction = {
  type: "deleteVfx";
  id: string;
};

export function deleteVfx(state: GameMap, action: DeleteVfxReducerAction): GameMap {
  const idx = state.visualEffects.findIndex((vfx) => vfx.id === action.id);

  state.visualEffects.splice(idx, 1);

  return { ...state };
}
