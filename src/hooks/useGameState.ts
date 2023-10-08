import { GameDispatchContext } from "@src/context/GameDispachContext";
import { GameFx, GameFxContext } from "@src/context/GameFxContext";
import { GameFxDispatchContext } from "@src/context/GameFxDispatchContext";
import { GameStateContext } from "@src/context/GameStateContext";
import { GameTerrain, GameTerrainContext } from "@src/context/GameTerrainContext";
import { GameUI, GameUIContext } from "@src/context/GameUIContext";
import { GameUiDispatchContext } from "@src/context/GameUIDispatchContext";
import { GameTerrainDispatchContext } from "@src/context/GateTerrainDispatchContext";
import { GameMap } from "@src/engine/gameMap";
import { FxReducerAction } from "@src/reducers/fx/_reducers";
import { TerrainReducerAction } from "@src/reducers/terrain/_reducers";
import { UIReducerAction } from "@src/reducers/ui/_reducers";
import { GameReducerAction } from "@src/reducers/_reducers";
import React from "react";

export type GameContext = {
  fxState: GameFx;
  fxDispatch: React.Dispatch<FxReducerAction>;
  terrainState: GameTerrain;
  terrainDispatch: React.Dispatch<TerrainReducerAction>;
  gameState: GameMap;
  gameDispatch: React.Dispatch<GameReducerAction>;
  uiState: GameUI;
  uiDispatch: React.Dispatch<UIReducerAction>;
};

export function useGameState(): GameContext {
  const fxState = React.useContext(GameFxContext);
  const fxDispatch = React.useContext(GameFxDispatchContext);

  const terrainState = React.useContext(GameTerrainContext);
  const terrainDispatch = React.useContext(GameTerrainDispatchContext);

  const uiState = React.useContext(GameUIContext);
  const uiDispatch = React.useContext(GameUiDispatchContext);

  const gameState = React.useContext(GameStateContext);
  const gameDispatch = React.useContext(GameDispatchContext);

  return {
    fxState,
    fxDispatch,
    terrainState,
    terrainDispatch,
    gameState,
    gameDispatch,
    uiState,
    uiDispatch,
  };
}
