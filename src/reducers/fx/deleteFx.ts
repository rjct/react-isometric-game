import { GameFx } from "@src/context/GameFxContext";

export type DeleteFxAction = {
  type: "deleteFx";
  id: string;
};

export function deleteFx(state: GameFx, action: DeleteFxAction): GameFx {
  state.effects = [...state.effects.filter((fx) => fx.id !== action.id)];

  return { ...state };
}
