import { GameDispatchContext } from "@src/context/GameDispachContext";
import { GameStateContext } from "@src/context/GameStateContext";
import { GameUI, GameUIContext } from "@src/context/GameUIContext";
import { GameUiDispatchContext } from "@src/context/GameUIDispatchContext";
import { GameMap } from "@src/engine/GameMap";
import { UIReducerAction } from "@src/reducers/ui/_reducers";
import { GameReducerAction } from "@src/reducers/_reducers";
import React from "react";

export type GameContext = {
  gameState: GameMap;
  gameDispatch: React.Dispatch<GameReducerAction>;
  uiState: GameUI;
  uiDispatch: React.Dispatch<UIReducerAction>;
};

export function useGameState(): GameContext {
  const uiState = React.useContext(GameUIContext);
  const uiDispatch = React.useContext(GameUiDispatchContext);

  const gameState = React.useContext(GameStateContext);
  const gameDispatch = React.useContext(GameDispatchContext);

  return {
    gameState,
    gameDispatch,
    uiState,
    uiDispatch,
  };
}
