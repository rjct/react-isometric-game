import { TerrainArea } from "@src/engine/TerrainAreaFactory";
import { useGameState } from "@src/hooks/useGameState";
import { mapsList } from "@src/maps_list";
import React from "react";

export function TerrainAreaExitUrlEditor() {
  const { terrainState, terrainDispatch } = useGameState();
  const [exitUrl, setExitUrl] = React.useState<TerrainArea["exitUrl"]>(terrainState.selectedTerrainArea.exitUrl);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value.trim();
    const exitUrl: TerrainArea["exitUrl"] = value === "" ? null : value;

    setExitUrl(exitUrl);
    terrainDispatch({
      type: "setTerrainAreaExitUrl",
      entityId: terrainState.selectedTerrainArea.id,
      exitUrl,
    });
  };

  React.useEffect(() => {
    setExitUrl(terrainState.selectedTerrainArea?.exitUrl);
  }, [terrainState.selectedTerrainArea?.exitUrl]);

  return (
    <select value={exitUrl || ""} onChange={handleChange}>
      <option value={""}>-- None --</option>
      {Object.entries(mapsList).map(([key, value]) => (
        <option key={`/${key}`} value={value}>
          {key}
        </option>
      ))}
    </select>
  );
}
