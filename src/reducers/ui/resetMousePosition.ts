import { GameUI } from "../../context/GameUIContext";

export type ResetMousePositionUIReducerAction = {
  type: "resetMousePosition";
};

// eslint-disable-next-line  @typescript-eslint/no-unused-vars
export function resetMousePosition(state: GameUI, action: ResetMousePositionUIReducerAction): GameUI {
  return {
    ...state,
    ...{
      mousePosition: {
        grid: { x: Infinity, y: Infinity },
        screen: { x: Infinity, y: Infinity },
        browser: { x: Infinity, y: Infinity },
        isOutOfGrid: true,
      },
      scrollDirection: "none",
    },
  };
}
