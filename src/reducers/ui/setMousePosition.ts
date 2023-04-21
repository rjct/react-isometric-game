import { GameUI } from "../../context/GameUIContext";

export type SetMousePositionUIReducerAction = {
  type: "setMousePosition";
  mousePosition: GameUI["mousePosition"];
};

export const setMousePosition = (state: GameUI, action: SetMousePositionUIReducerAction): GameUI => {
  return {
    ...state,
    ...{ mousePosition: action.mousePosition },
  };
};
