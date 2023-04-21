import { GameUI } from "../../context/GameUIContext";

export interface ProcessKeyPressUIReducerAction {
  type: "processKeyPress";
  scene: GameUI["scene"];
}

export function processKeyPress(state: GameUI, action: ProcessKeyPressUIReducerAction): GameUI {
  switch (action.scene) {
    case "game":
      if (state.keys["KeyI"]) {
        return {
          ...state,
          ...{
            scene: "inventory",
            keys: { ...state.keys, ...{ KeyI: false } },
          },
        };
      }

      if (state.keys["KeyC"]) {
        return state;
      }
      break;

    case "inventory":
      if (state.keys["KeyI"]) {
        return {
          ...state,
          ...{
            scene: "game",
            keys: { ...state.keys, ...{ KeyI: false } },
          },
        };
      }

      if (state.keys["Escape"]) {
        return {
          ...state,
          ...{
            scene: "game",
            keys: { ...state.keys, ...{ Escape: false } },
          },
        };
      }
      break;
  }

  return state;
}
