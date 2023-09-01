import { GameUI } from "@src/context/GameUIContext";

export type SetViewportUIReducerAction = {
  type: "setViewport";
  viewport: GameUI["viewport"];
};

export const setViewport = (state: GameUI, action: SetViewportUIReducerAction): GameUI => {
  return {
    ...state,
    ...{ viewport: action.viewport },
  };
};
