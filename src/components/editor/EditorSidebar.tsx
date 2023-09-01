import { EditorModeSelector } from "@src/components/editor/EditorModeSelector";
import { ExportButton } from "@src/components/editor/ExportButton";
import { constants } from "@src/constants";
import { useGameState } from "@src/hooks/useGameState";
import React from "react";

export const EditorSidebar = React.memo(function EditorSidebar() {
  const { uiState } = useGameState();

  return uiState.scene === "editor" ? (
    <div
      className={"editor"}
      style={{
        width: constants.editor.propsEditor.width,
        marginLeft: -constants.editor.propsEditor.width,
      }}
    >
      <EditorModeSelector />

      <div className={"editor-toolbar"}>
        <ExportButton />
      </div>
    </div>
  ) : null;
});
