import { GameUI } from "@src/context/GameUIContext";
import { useGameState } from "@src/hooks/useGameState";

export function useEditor() {
  const { uiState } = useGameState();
  const checkEditorMode = (editorMode: GameUI["editorMode"][]) => {
    return editorMode.includes(uiState.editorMode);
  };

  return { checkEditorMode };
}
