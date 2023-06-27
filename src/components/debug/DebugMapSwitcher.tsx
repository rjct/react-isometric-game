import React from "react";
import { useGameState } from "../../hooks/useGameState";

import { constants } from "../../constants";

export const DebugMapSwitcher = React.memo(() => {
  const { gameState, gameDispatch } = useGameState();
  const [mapsList, setMapsList] = React.useState<Array<string>>([]);
  const [mapUrl, setMapUrl] = React.useState(gameState.mapUrl);

  const handleMapUrlChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setMapUrl(e.target.value);
  };

  React.useEffect(() => {
    gameDispatch({ type: "loadMap", mapUrl });
  }, [mapUrl]);

  React.useEffect(() => {
    setMapUrl(gameState.mapUrl);
  }, [gameState.mapUrl]);

  React.useEffect(() => {
    fetch(`${constants.BASE_URL}/maps/_maps_list.json`).then(async (data) => {
      const json = await data.json();

      setMapsList(json);
    });
  }, []);

  return (
    <>
      <select value={mapUrl} onChange={handleMapUrlChange}>
        {mapsList.map((mapFileName) => (
          <option key={mapFileName} value={`maps/${mapFileName}`}>
            {mapFileName}
          </option>
        ))}
      </select>
      <span>
        ({gameState.mapSize.width}x{gameState.mapSize.height})
      </span>
    </>
  );
});
