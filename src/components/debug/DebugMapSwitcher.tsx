import React from "react";
import { useGameState } from "../../hooks/useGameState";
import { mapsList } from "../../maps_list";

export const DebugMapSwitcher = React.memo(() => {
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
