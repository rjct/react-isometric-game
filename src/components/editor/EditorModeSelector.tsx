import { EditorModes, GameUI } from "../../context/GameUIContext";
import React from "react";
import { useGameState } from "../../hooks/useGameState";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { TerrainAreaAddNewButton } from "./terrain/TerrainAreaAddNewButton";
import { TerrainAreaPropsEditor } from "./terrain/TerrainAreaPropsEditor";
import { BuildingPropsEditor } from "./building/BuildingPropsEditor";

export function EditorModeSelector() {
  const { gameDispatch, uiState, uiDispatch } = useGameState();

  const [editorMode, setEditorMode] = React.useState(uiState.editorMode);

  const handleEditorModeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const editorMode = e.target.value as GameUI["editorMode"];

    setEditorMode(editorMode);

    gameDispatch({ type: "clearSelectedTerrainArea" });
    gameDispatch({ type: "clearSelectedBuilding" });

    uiDispatch({ type: "setEditorMode", editorMode });
  };

  return uiState.scene === "editor" ? (
    <div className={"ui-tabs"}>
      <div className={"ui-tabs-nav"}>
        {Object.entries(EditorModes).map(([key, value]) => {
          const isActive = editorMode === key;
          const activeClass = isActive ? "active" : "";

          return (
            <div className={["ui-button", activeClass].join(" ")} key={key}>
              <label className="ui-radio" htmlFor={`editor-mode-${key}`} title={value.text}>
                <input
                  type={"radio"}
                  name={"editor-mode"}
                  id={`editor-mode-${key}`}
                  value={key}
                  checked={isActive}
                  disabled={isActive}
                  onChange={handleEditorModeChange}
                />
                <div className={"label"}>
                  <span>{<FontAwesomeIcon icon={value.icon} />}</span>
                </div>
              </label>
            </div>
          );
        })}
      </div>

      {uiState.editorMode === "terrain" ? (
        <div className={"ui-tab-content"}>
          <div className={"toolbar"}>
            <TerrainAreaAddNewButton />
          </div>
          <TerrainAreaPropsEditor />
        </div>
      ) : null}

      {uiState.editorMode === "building" ? (
        <div className={"ui-tab-content"}>
          <BuildingPropsEditor />
        </div>
      ) : null}

      {uiState.editorMode === "unit" ? <div className={"ui-tab-content"}>todo</div> : null}
    </div>
  ) : null;
}
