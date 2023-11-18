import { TerrainAreaLayer } from "@src/components/editor/terrain/layers/TerrainAreaLayer";
import { TerrainArea } from "@src/engine/terrain/TerrainAreaFactory";
import { useGameState } from "@src/hooks/useGameState";
import React from "react";

export function TerrainAreaLayersEditor() {
  const { terrainState, terrainDispatch } = useGameState();
  const activeElementRef = React.createRef<HTMLLIElement>();

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, terrainArea: TerrainArea) => {
    terrainDispatch({ type: "setSelectedTerrainArea", entity: terrainArea });

    e.preventDefault();
  };

  const handleVisibilityChange = (terrainArea: TerrainArea, visibility: boolean) => {
    terrainDispatch({ type: "setTerrainAreaVisibility", entityId: terrainArea.id, visibility });
  };

  React.useEffect(() => {
    if (activeElementRef.current) {
      activeElementRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [terrainState.selectedTerrainArea]);

  return (
    <fieldset className={"terrain-area-layers"}>
      <legend>Terrain layers</legend>

      <ul>
        {terrainState.areas.map((terrainArea, index) => (
          <TerrainAreaLayer
            ref={terrainArea.id === terrainState.selectedTerrainArea?.id ? activeElementRef : null}
            key={index}
            terrainArea={terrainArea}
            selected={terrainArea.id === terrainState.selectedTerrainArea?.id}
            onClick={handleClick}
            onVisibilityChange={handleVisibilityChange}
          />
        ))}
      </ul>
    </fieldset>
  );
}
