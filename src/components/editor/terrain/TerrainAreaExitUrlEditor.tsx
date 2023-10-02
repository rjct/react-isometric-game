import { mapsList } from "@src/engine/maps_list";
import { TerrainArea } from "@src/engine/terrain/TerrainAreaFactory";
import { useGameState } from "@src/hooks/useGameState";
import React from "react";

export const TerrainAreaExitUrlEditor = React.memo((props: { terrainArea: TerrainArea }) => {
  const { terrainDispatch } = useGameState();
  const [exitUrl, setExitUrl] = React.useState<TerrainArea["exitUrl"]>(null);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value.trim();
    const exitUrl: TerrainArea["exitUrl"] = value === "" ? null : value;

    setExitUrl(exitUrl);
    terrainDispatch({
      type: "setTerrainAreaExitUrl",
      entityId: props.terrainArea.id,
      exitUrl,
    });
  };

  React.useEffect(() => {
    setExitUrl(props.terrainArea.exitUrl);
  }, [props.terrainArea.exitUrl]);

  return (
    <select value={exitUrl || ""} onChange={handleChange}>
      <option value={""}>-- None --</option>
      {Object.entries(mapsList).map(([key, value]) => (
        <option key={`/${key}`} value={`/${value}`}>
          {key}
        </option>
      ))}
    </select>
  );
});
