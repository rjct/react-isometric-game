import { GameMap } from "@src/engine/gameMap";
import { Vfx, VfxType } from "@src/engine/vfx/VfxFactory";

export type EmitVfxReducerAction = {
  type: "emitVfx";
  coordinates: GridCoordinates;
  effectType: VfxType;
  angle?: AngleInDegrees;
};

export function emitVfx(state: GameMap, action: EmitVfxReducerAction): GameMap {
  state.visualEffects.push(new Vfx({ coordinates: action.coordinates, type: action.effectType, angle: action.angle }));

  return { ...state };
}
