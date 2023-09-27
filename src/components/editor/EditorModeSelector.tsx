import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { BuildingPropsEditor } from "@src/components/editor/building/BuildingPropsEditor";
import { GlobalLightsPropsEditor } from "@src/components/editor/light/GlobalLightsPropsEditor";
import { GlobalShadowsPropsEditor } from "@src/components/editor/light/GlobalShadowsPropsEditor";
import { LightAddNewButton } from "@src/components/editor/light/LightAddNewButton";
import { LightPropsEditor } from "@src/components/editor/light/LightPropsEditor";
import { TerrainAreaLayersEditor } from "@src/components/editor/terrain/layers/TerrainAreaLayersEditor";
import { TerrainAreaAddNewButton } from "@src/components/editor/terrain/TerrainAreaAddNewButton";
import { TerrainAreaPropsEditor } from "@src/components/editor/terrain/TerrainAreaPropsEditor";
import { UnitPropsEditor } from "@src/components/editor/unit/UnitPropsEditor";
import { Tab } from "@src/components/ui/Tab";
import { EditorModes, GameUI } from "@src/context/GameUIContext";
import { useGameState } from "@src/hooks/useGameState";
import { useScene } from "@src/hooks/useScene";
import React from "react";

export const EditorModeSelector = React.memo(function EditorModeSelector() {
  const { terrainDispatch, gameState, gameDispatch, uiState, uiDispatch } = useGameState();
  const { checkCurrentScene } = useScene();

  if (!checkCurrentScene(["editor"])) return null;

  const [editorMode, setEditorMode] = React.useState(uiState.editorMode);

  const selectedUnit = React.useMemo(() => gameState.selectedUnit, [gameState.selectedUnit]);

  const handleEditorModeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const editorMode = e.target.value as GameUI["editorMode"];

    setEditorMode(editorMode);

    terrainDispatch({ type: "clearSelectedTerrainArea" });
    gameDispatch({ type: "clearSelectedBuilding" });
    gameDispatch({ type: "clearSelectedUnit" });
    gameDispatch({ type: "clearSelectedLight" });
    gameDispatch({ type: "clearEntityPlaceholder" });

    gameDispatch({ type: "stopUnits", units: gameState.getAllAliveUnitsArray() });

    if (editorMode === "lights") {
      gameDispatch({ type: "recalculateLightsAndShadows" });
    }

    uiDispatch({ type: "setEditorMode", editorMode });
  };

  return (
    <div className={"ui-tabs"}>
      <div className={"ui-tabs-nav"}>
        {Object.entries(EditorModes).map(([key, value]) => {
          const isActive = editorMode === key;

          return (
            <Tab
              key={key}
              id={`editor-mode-${key}`}
              value={key}
              active={isActive}
              disabled={isActive}
              title={value.text}
              onSelect={handleEditorModeChange}
            >
              <FontAwesomeIcon icon={value.icon} />
            </Tab>
          );
        })}
      </div>

      {uiState.editorMode === "terrain" ? (
        <div className={"ui-tab-content"}>
          <TerrainAreaLayersEditor />
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
  );
});
