import { GameUI } from "../../context/GameUIContext";

export type DetectKeyPressUIReducerAction = {
  type: "detectKeyPress";
  keyCode: KeyboardEvent["code"];
  keyPressState: boolean;
};
export function detectKeyPress(state: GameUI, action: DetectKeyPressUIReducerAction): GameUI {
  if (!action.keyCode) return state;

  return {
    ...state,
    ...{
      keys: {
        ...state.keys,
        ...{ [action.keyCode as string]: action.keyPressState },
      },
    },
  };
}
