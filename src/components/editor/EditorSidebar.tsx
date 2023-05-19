import React from "react";
import { useGameState } from "../../hooks/useGameState";
import { constants } from "../../constants";
import { EditorModeSelector } from "./EditorModeSelector";
import { ExportButton } from "./ExportButton";

export function EditorSidebar() {
  const { uiState } = useGameState();

  return uiState.scene === "editor" ? (
    <div
      className={"editor"}
      style={{
        width: constants.editor.propsEditor.width,
        marginLeft: -constants.editor.propsEditor.width,
        top: uiState.rect.top,
      }}
    >
      <EditorModeSelector />

      <div className={"editor-toolbar"}>
        <ExportButton />
      </div>
    </div>
  ) : null;
}
