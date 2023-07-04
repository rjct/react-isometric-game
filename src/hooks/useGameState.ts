import React from "react";
import { GameUI, GameUIContext } from "../context/GameUIContext";
import { GameUiDispatchContext } from "../context/GameUIDispatchContext";
import { GameStateContext } from "../context/GameStateContext";
import { GameDispatchContext } from "../context/GameDispachContext";
import { GameMap } from "../engine/GameMap";
import { GameReducerAction } from "../reducers/_reducers";
import { UIReducerAction } from "../reducers/ui/_reducers";

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
