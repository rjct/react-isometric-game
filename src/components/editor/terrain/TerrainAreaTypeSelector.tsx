import terrain from "@src/dict/terrain.json";
import { TerrainAreaType } from "@src/engine/terrain/TerrainAreaFactory";
import { useGameState } from "@src/hooks/useGameState";
import React from "react";

export function TerrainAreaTypeSelector() {
  const { terrainState, terrainDispatch } = useGameState();
  const [selectedAreaType, setSelectedAreaType] = React.useState("empty");

  const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const areaType = e.target.value as TerrainAreaType;

    setSelectedAreaType(areaType);
    terrainDispatch({ type: "setTerrainAreaType", entityId: terrainState.selectedTerrainArea.id, areaType });
  };

  React.useEffect(() => {
    setSelectedAreaType(terrainState.selectedTerrainArea?.source.type || "empty");
  }, [terrainState.selectedTerrainArea]);

  return (
    <select value={selectedAreaType} disabled={!terrainState.selectedTerrainArea} onChange={handleTypeChange}>
      {Object.entries(terrain).map(([key, value]) => {
        return (
          <option key={key} value={key}>
            {value.title}
          </option>
        );
      })}
    </select>
  );
}
