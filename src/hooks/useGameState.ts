import React from "react";
import { GameUIContext } from "../context/GameUIContext";
import { GameUiDispatchContext } from "../context/GameUIDispatchContext";
import { GameStateContext } from "../context/GameStateContext";
import { GameDispatchContext } from "../context/GameDispachContext";

export function useGameState() {
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
