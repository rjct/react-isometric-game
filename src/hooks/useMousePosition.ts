import { constants } from "../constants";
import { useGameState } from "./useGameState";
import React from "react";
import { floor } from "../engine/helpers";

export interface WorldMousePosition {
  grid: { x: number; y: number };
  screen: { x: number; y: number };
  browser: { x: number; y: number };
  isOutOfGrid: boolean;
}

export function useMousePosition() {
  const { gameState, uiState } = useGameState();

  const getWorldMousePosition = (e: React.MouseEvent): WorldMousePosition => {
    const { rect, scroll } = uiState;

    const browser = {
      x: Math.round(e.clientX + scroll.x) - scroll.x,
      y: Math.round(e.clientY - rect.top) - scroll.y,
    };

    const screen = {
      x: Math.round(e.clientX - constants.tileSize.width + constants.tileSize.width / 2 + scroll.x),
      y: Math.round(e.clientY - rect.top) + scroll.y,
    };
    const grid = gameState.screenSpaceToGridSpace(screen);

    return {
      grid: {
        x: floor(grid.x),
        y: floor(grid.y),
      },
      screen: screen,
      browser: browser,
      isOutOfGrid:
        floor(grid.x) < 0 ||
        floor(grid.x) > gameState.mapSize.width - 1 ||
        floor(grid.y) < 0 ||
        floor(grid.y) > gameState.mapSize.height - 1,
    };
  };

  return { getWorldMousePosition };
}
