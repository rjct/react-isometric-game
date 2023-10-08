import { EffectType, GameFx } from "@src/context/GameFxContext";
import { Fx } from "@src/engine/fx/FxFactory";

export type AddFxAction = {
  type: "addFx";
  coordinates: GridCoordinates;
  effectType: EffectType;
};

export function addFx(state: GameFx, action: AddFxAction): GameFx {
  state.effects.push(new Fx({ coordinates: action.coordinates, type: action.effectType }));

  return { ...state };
}
