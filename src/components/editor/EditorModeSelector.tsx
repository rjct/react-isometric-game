import { EditorModes, GameUI } from "../../context/GameUIContext";
import React from "react";
import { useGameState } from "../../hooks/useGameState";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { TerrainAreaAddNewButton } from "./terrain/TerrainAreaAddNewButton";
import { TerrainAreaPropsEditor } from "./terrain/TerrainAreaPropsEditor";
import { BuildingPropsEditor } from "./building/BuildingPropsEditor";
import { LightAddNewButton } from "./light/LightAddNewButton";
import { LightPropsEditor } from "./light/LightPropsEditor";
import { GlobalShadowsPropsEditor } from "./light/GlobalShadowsPropsEditor";
import { UnitPropsEditor } from "./unit/UnitPropsEditor";
import { GlobalLightsPropsEditor } from "./light/GlobalLightsPropsEditor";

export const EditorModeSelector = React.memo(function EditorModeSelector() {
  const { gameState, gameDispatch, uiState, uiDispatch } = useGameState();

  const [editorMode, setEditorMode] = React.useState(uiState.editorMode);

  const selectedUnit = React.useMemo(() => gameState.selectedUnit, [gameState.selectedUnit]);

  const handleEditorModeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const editorMode = e.target.value as GameUI["editorMode"];

    setEditorMode(editorMode);

    gameDispatch({ type: "clearSelectedTerrainArea" });
    gameDispatch({ type: "clearSelectedBuilding" });
    gameDispatch({ type: "clearSelectedUnit" });
    gameDispatch({ type: "clearSelectedLight" });

    gameDispatch({ type: "stopUnits", units: gameState.getAllAliveUnitsArray() });

    if (editorMode === "lights") {
      gameDispatch({ type: "recalculateLightsAndShadows" });
    }

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
          <TerrainAreaPropsEditor />
          <div className={"toolbar"}>
            <TerrainAreaAddNewButton />
          </div>
        </div>
      ) : null}

      {uiState.editorMode === "buildings" ? (
        <div className={"ui-tab-content"}>
          <BuildingPropsEditor />
        </div>
      ) : null}

      {uiState.editorMode === "units" ? (
        <div className={"ui-tab-content"}>
          <UnitPropsEditor unit={selectedUnit} />
        </div>
      ) : null}

      {uiState.editorMode === "lights" ? (
        <div className={"ui-tab-content"}>
          <GlobalShadowsPropsEditor />
          <GlobalLightsPropsEditor />
          <LightPropsEditor />
          <div className={"toolbar"}>
            <LightAddNewButton />
          </div>
        </div>
      ) : null}
    </div>
  ) : null;
});
