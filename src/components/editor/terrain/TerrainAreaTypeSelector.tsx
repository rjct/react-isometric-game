import terrain from "@src/dict/terrain.json";
import { TerrainArea, TerrainAreaType } from "@src/engine/terrain/TerrainAreaFactory";
import { useGameState } from "@src/hooks/useGameState";
import React from "react";

export const TerrainAreaTypeSelector = React.memo((props: { terrainArea: TerrainArea }) => {
  const { terrainDispatch } = useGameState();
  const [selectedAreaType, setSelectedAreaType] = React.useState("empty");

  const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const areaType = e.target.value as TerrainAreaType;

    setSelectedAreaType(areaType);
    terrainDispatch({ type: "setTerrainAreaType", entityId: props.terrainArea.id, areaType });
  };

  React.useEffect(() => {
    setSelectedAreaType(props.terrainArea.source.type || "empty");
  }, [props.terrainArea]);

  return (
    <select value={selectedAreaType} disabled={!props.terrainArea} onChange={handleTypeChange}>
      {Object.entries(terrain).map(([key, value]) => {
        return (
          <option key={key} value={key}>
            {value.title}
          </option>
        );
      })}
    </select>
  );
});
