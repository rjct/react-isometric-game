import { GameTerrain } from "@src/context/GameTerrainContext";
import { GameUI } from "@src/context/GameUIContext";
import { GameMap } from "@src/engine/gameMap";

export interface ProcessKeyPressUIReducerAction {
  type: "processKeyPress";
  gameState: GameMap;
  terrainState: GameTerrain;
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

      if (state.keys["Backquote"]) {
        return {
          ...state,
          ...{
            scene: "debugSetting",
            keys: { ...state.keys, ...{ Backquote: false } },
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
            action.terrainState.deleteSelectedTerrainArea();
            break;
        }

        return {
          ...state,
          ...{
            keys: { ...state.keys, ...{ Backspace: false } },
          },
        };
      }

      if (state.keys["Backquote"]) {
        return {
          ...state,
          ...{
            scene: "debugSetting",
            keys: { ...state.keys, ...{ Backquote: false } },
          },
        };
      }
      break;

    case "debugSetting":
      if (state.keys["Backquote"]) {
        return {
          ...state,
          ...{
            scene: "game",
            keys: { ...state.keys, ...{ Backquote: false } },
          },
        };
      }
  }

  return state;
}
