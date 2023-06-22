import { GameUI } from "../../context/GameUIContext";
import { GameMap } from "../../engine/GameMap";

export interface ProcessKeyPressUIReducerAction {
  type: "processKeyPress";
  gameState: GameMap;
}

export function processKeyPress(state: GameUI, action: ProcessKeyPressUIReducerAction): GameUI {
  switch (state.scene) {
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

    case "editor":
      if (state.keys["Backspace"]) {
        switch (state.editorMode) {
          case "buildings":
            action.gameState.deleteSelectedBuilding();
            break;

          case "terrain":
            action.gameState.deleteSelectedTerrainArea();
            break;
        }

        return {
          ...state,
          ...{
            keys: { ...state.keys, ...{ Backspace: false } },
          },
        };
      }
      break;
  }

  return state;
}
