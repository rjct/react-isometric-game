import { TerrainAreaType, TerrainAreaTypes } from "../../../engine/TerrainAreaFactory";
import React from "react";
import { useGameState } from "../../../hooks/useGameState";

export function TerrainAreaTypeSelector() {
  const { gameState, gameDispatch } = useGameState();
  const [selectedAreaType, setSelectedAreaType] = React.useState("empty");

  const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const areaType = e.target.value as TerrainAreaType;

    setSelectedAreaType(areaType);
    gameDispatch({ type: "setTerrainAreaType", entityId: gameState.selectedTerrainArea.id, areaType });
  };

  React.useEffect(() => {
    setSelectedAreaType(gameState.selectedTerrainArea?.source.type || "empty");
  }, [gameState.selectedTerrainArea]);

  return (
    <select value={selectedAreaType} disabled={!gameState.selectedTerrainArea} onChange={handleTypeChange}>
      {Object.entries(TerrainAreaTypes).map(([key, value]) => {
        return (
          <option key={key} value={key}>
            {value}
          </option>
        );
      })}
    </select>
  );
}
