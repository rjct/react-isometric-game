import { GameUI } from "../../context/GameUIContext";

export type ScrollMapUIReducerAction = {
  type: "scrollMap";
  scroll: GameUI["scroll"];
};
export const scrollMap = (state: GameUI, action: ScrollMapUIReducerAction): GameUI => {
  return {
    ...state,
    ...{ scroll: action.scroll },
  };
};
