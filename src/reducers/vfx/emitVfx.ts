import { GameMap } from "@src/engine/gameMap";
import { Vfx, VfxLight, VfxType } from "@src/engine/vfx/VfxFactory";

export type EmitVfxReducerAction = {
  type: "emitVfx";
  coordinates: GridCoordinates;
  effectType: VfxType;
  animationDuration: number;
  angle?: AngleInDegrees;
  light?: VfxLight;
};

export function emitVfx(state: GameMap, action: EmitVfxReducerAction): GameMap {
  const vfx = new Vfx({
    coordinates: action.coordinates,
    type: action.effectType,
    angle: action.angle,
    animationDuration: action.animationDuration,
    light: action.light,
  });

  state.visualEffects.push(vfx);

  if (vfx.lightEffect?.light) {
    state.lights.push(vfx.lightEffect.light);
    vfx.lightEffect.light.cast(state.getAllGameEntitiesWalls());
  }

  return { ...state };
}
