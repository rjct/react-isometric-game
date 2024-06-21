import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { BuildingPropsEditor } from "@src/components/editor/building/BuildingPropsEditor";
import { GlobalLightsPropsEditor } from "@src/components/editor/light/GlobalLightsPropsEditor";
import { GlobalShadowsPropsEditor } from "@src/components/editor/light/GlobalShadowsPropsEditor";
import { LightAddNewButton } from "@src/components/editor/light/LightAddNewButton";
import { LightPropsEditor } from "@src/components/editor/light/LightPropsEditor";
import { TerrainAreaAddNewButton } from "@src/components/editor/terrain/TerrainAreaAddNewButton";
import { TerrainAreaPropsEditor } from "@src/components/editor/terrain/TerrainAreaPropsEditor";
import { TerrainAreaLayersEditor } from "@src/components/editor/terrain/layers/TerrainAreaLayersEditor";
import { UnitPropsEditor } from "@src/components/editor/unit/UnitPropsEditor";
import { VehiclePropsEditor } from "@src/components/editor/vehicle/VehiclePropsEditor";
import { Tab } from "@src/components/ui/Tab";
import { EditorModes, GameUI } from "@src/context/GameUIContext";
import { Building } from "@src/engine/building/BuildingFactory";
import { Light } from "@src/engine/light/LightFactory";
import { Unit } from "@src/engine/unit/UnitFactory";
import { Vehicle } from "@src/engine/vehicle/VehicleFactory";
import { useGameState } from "@src/hooks/useGameState";
import { useScene } from "@src/hooks/useScene";
import React from "react";

export const EditorModeSelector = React.memo(function EditorModeSelector() {
  const { terrainState, terrainDispatch, gameState, gameDispatch, uiState, uiDispatch } = useGameState();
  const { checkCurrentScene } = useScene();

  if (!checkCurrentScene(["editor"])) return null;

  const [editorMode, setEditorMode] = React.useState(uiState.editorMode);

  const selectedTerrainArea = React.useMemo(() => terrainState.selectedTerrainArea, [terrainState.selectedTerrainArea]);
  const selectedEntity = React.useMemo(() => gameState.selectedEntity, [gameState.selectedEntity]);

  const handleEditorModeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const editorMode = e.target.value as GameUI["editorMode"];

    setEditorMode(editorMode);

    terrainDispatch({ type: "clearSelectedTerrainArea" });
    gameDispatch({ type: "clearSelectedEntity" });
    gameDispatch({ type: "clearSelectedBuilding" });
    gameDispatch({ type: "clearSelectedVehicle" });
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
        {Object.entries(EditorModes).map(([key, mode]) => {
          if (!mode.tab) return null;
          const isActive = editorMode === key;

          return (
            <Tab
              key={key}
              id={`editor-mode-${key}`}
              value={key}
              active={isActive}
              disabled={isActive}
              title={mode.text}
              onSelect={handleEditorModeChange}
            >
              <FontAwesomeIcon icon={mode.icon} />
            </Tab>
          );
        })}
      </div>

      {uiState.editorMode === "terrain" ? (
        <div className={"ui-tab-content terrain-area-layers-editor"}>
          <TerrainAreaLayersEditor />
          <TerrainAreaPropsEditor terrainArea={selectedTerrainArea} />

          <div className={"toolbar"}>
            <TerrainAreaAddNewButton />
          </div>
        </div>
      ) : null}

      {uiState.editorMode === "buildings" ? (
        <div className={"ui-tab-content"}>
          <BuildingPropsEditor building={selectedEntity as Building} />
        </div>
      ) : null}

      {uiState.editorMode === "vehicles" ? (
        <div className={"ui-tab-content"}>
          <VehiclePropsEditor vehicle={selectedEntity as Vehicle} />
        </div>
      ) : null}

      {uiState.editorMode === "units" ? (
        <div className={"ui-tab-content"}>
          <UnitPropsEditor unit={selectedEntity as Unit} />
        </div>
      ) : null}

      {uiState.editorMode === "lights" ? (
        <div className={"ui-tab-content"}>
          <GlobalShadowsPropsEditor />
          <GlobalLightsPropsEditor />
          <LightPropsEditor light={selectedEntity as unknown as Light} />
          <div className={"toolbar"}>
            <LightAddNewButton />
          </div>
        </div>
      ) : null}
    </div>
  );
});
