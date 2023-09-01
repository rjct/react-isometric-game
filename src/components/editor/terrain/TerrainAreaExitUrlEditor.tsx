import { TerrainArea } from "@src/engine/TerrainAreaFactory";
import { useGameState } from "@src/hooks/useGameState";
import React from "react";

export function TerrainAreaExitUrlEditor() {
  const { gameState, gameDispatch } = useGameState();
  const [exitUrl, setExitUrl] = React.useState(null as unknown as TerrainArea["exitUrl"]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    e.stopPropagation();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.trim();
    const exitUrl: TerrainArea["exitUrl"] = value === "" ? null : value;

    setExitUrl(exitUrl);
    gameDispatch({
      type: "setTerrainAreaExitUrl",
      entityId: gameState.selectedTerrainArea.id,
      exitUrl,
    });
  };

  React.useEffect(() => {
    setExitUrl(gameState.selectedTerrainArea?.exitUrl);
  }, [gameState.selectedTerrainArea?.exitUrl]);

  return (
    <input
      type={"url"}
      defaultValue={exitUrl || ""}
      placeholder={"/maps/___.json"}
      onKeyDown={handleKeyDown}
      onChange={handleChange}
      onBlur={handleChange}
    />
  );
}
