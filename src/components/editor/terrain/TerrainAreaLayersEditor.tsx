import { TerrainAreaLayer } from "@src/components/editor/terrain/TerrainAreaLayer";
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

  React.useEffect(() => {
    if (activeElementRef.current) {
      activeElementRef.current.scrollIntoView();
    }
  }, [terrainState.selectedTerrainArea]);

  return (
    <div className={"terrain-area-layers-editor"}>
      <fieldset>
        <legend>Terrain layers</legend>

        <ul className={"terrain-area-layers"}>
          {terrainState.areas.map((terrainArea, index) => (
            <TerrainAreaLayer
              ref={terrainArea.id === terrainState.selectedTerrainArea?.id ? activeElementRef : null}
              key={index}
              terrainArea={terrainArea}
              selected={terrainArea.id === terrainState.selectedTerrainArea?.id}
              onClick={handleClick}
            />
          ))}
        </ul>
      </fieldset>
    </div>
  );
}
