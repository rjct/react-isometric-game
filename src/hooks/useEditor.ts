import { constants } from "@src/constants";
import { GameUI } from "@src/context/GameUIContext";
import { useGameState } from "@src/hooks/useGameState";
import { useScene } from "@src/hooks/useScene";

export function useEditor() {
  const { uiState } = useGameState();
  const { checkCurrentScene } = useScene();
  const checkEditorMode = (editorMode: GameUI["editorMode"][]) => {
    return editorMode.includes(uiState.editorMode);
  };

  const getEditorLibraryPosition = () => {
    return checkCurrentScene(["editor"]) && checkEditorMode(["units", "buildings"])
      ? constants.editor.entitiesLibrary.width + constants.editor.entitiesLibrary.left
      : 0;
  };

  return { checkEditorMode, getEditorLibraryPosition };
}
