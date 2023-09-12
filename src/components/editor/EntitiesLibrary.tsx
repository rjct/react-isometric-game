import { BuildingLibrary } from "@src/components/editor/building/BuildingLibrary";
import { UnitLibrary } from "@src/components/editor/unit/UnitLibrary";
import { constants } from "@src/constants";
import { useEditor } from "@src/hooks/useEditor";
import { useGameState } from "@src/hooks/useGameState";
import { useScene } from "@src/hooks/useScene";

export function EntitiesLibrary() {
  const { gameState, uiState } = useGameState();
  const { checkCurrentScene } = useScene();
  const { checkEditorMode } = useEditor();

  if (!checkCurrentScene(["editor"]) || !checkEditorMode(["buildings", "units"])) return null;

  return (
    <div
      className={`editor-library editor-library-${uiState.editorMode}`}
      style={{
        width: constants.editor.entitiesLibrary.width,
        left: constants.editor.entitiesLibrary.left,
        top: gameState.debug.enabled ? 130 : undefined,
        bottom: gameState.debug.enabled ? 70 : undefined,
      }}
    >
      <BuildingLibrary />
      <UnitLibrary />
    </div>
  );
}
