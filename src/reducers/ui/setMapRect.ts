import { GameUI } from "@src/context/GameUIContext";

export type SetMapRectUIReducerAction = {
  type: "setMapRect";
  rect: DOMRect;
};

export const setMapRect = (state: GameUI, action: SetMapRectUIReducerAction): GameUI => {
  return {
    ...state,
    ...{ rect: action.rect },
  };
};
