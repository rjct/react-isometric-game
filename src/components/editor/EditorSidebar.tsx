import { EditorModeSelector } from "@src/components/editor/EditorModeSelector";
import { ExportButton } from "@src/components/editor/ExportButton";
import { constants } from "@src/engine/constants";
import { useScene } from "@src/hooks/useScene";
import React from "react";

export const EditorSidebar = React.memo(function EditorSidebar() {
  const { checkCurrentScene } = useScene();

  if (!checkCurrentScene(["editor"])) return null;

  return (
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
  );
});
