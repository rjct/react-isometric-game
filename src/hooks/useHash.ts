import React from "react";
import { useGameState } from "./useGameState";

export function useHash() {
  const { gameState } = useGameState();

  const matrixHash = React.useMemo(() => gameState.getMatrixHash(), [gameState.getMatrixHash()]);

  const fogOfWarMatrixHash = React.useMemo(
    () => gameState.getFogOfWarMatrixHash(),
    [gameState.getFogOfWarMatrixHash()]
  );

  const lightsHash = React.useMemo(() => gameState.getLightsHash(), [gameState.getLightsHash()]);

  const allAliveUnitsHash = React.useMemo(() => gameState.getAllAliveUnitsHash(), [gameState.getAllAliveUnitsHash()]);

  return { matrixHash, fogOfWarMatrixHash, lightsHash, allAliveUnitsHash };
}
