import { GameUI } from "@src/context/GameUIContext";

export type ScrollMapUIReducerAction = {
  type: "scrollMap";
  scroll: GameUI["scroll"];
};

export type ScrollMapCompleteUIReducerAction = {
  type: "scrollMapComplete";
};

export const scrollMap = (state: GameUI, action: ScrollMapUIReducerAction): GameUI => {
  return {
    ...state,
    ...{ scroll: action.scroll, isScrolling: true },
  };
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const scrollMapComplete = (state: GameUI, action: ScrollMapCompleteUIReducerAction): GameUI => {
  return {
    ...state,
    ...{ isScrolling: false },
  };
};
