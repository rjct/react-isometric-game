import { GameUI } from "@src/context/GameUIContext";

export type SetEditorModeUIReducerAction = {
  type: "setEditorMode";
  editorMode: GameUI["editorMode"];
};

export function setEditorMode(state: GameUI, action: SetEditorModeUIReducerAction) {
  return { ...state, ...{ editorMode: action.editorMode } };
}
