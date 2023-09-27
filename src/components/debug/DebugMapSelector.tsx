import { useGameState } from "@src/hooks/useGameState";
import { mapsList } from "@src/engine/maps_list";
import React from "react";

export const DebugMapSelector = React.memo(() => {
  const { gameState, gameDispatch } = useGameState();
  const [mapUrl, setMapUrl] = React.useState(gameState.mapUrl);

  const handleMapUrlChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setMapUrl(e.target.value as mapsList);
  };

  React.useEffect(() => {
    gameDispatch({ type: "loadMap", mapUrl });
  }, [mapUrl]);

  React.useEffect(() => {
    setMapUrl(gameState.mapUrl);
  }, [gameState.mapUrl]);

  if (!gameState.debug.enabled) return null;

  return (
    <>
      <select value={mapUrl} onChange={handleMapUrlChange}>
        {Object.entries(mapsList).map(([key, value]) => (
          <option key={value} value={value}>
            {key}
          </option>
        ))}
      </select>
      <span>
        ({gameState.mapSize.width}x{gameState.mapSize.height})
      </span>
    </>
  );
});
