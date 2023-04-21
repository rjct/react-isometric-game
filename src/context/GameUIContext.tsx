import React from "react";

const gameUIContext = {
  keys: {} as { [code: KeyboardEvent["code"]]: boolean },
  scroll: { x: 0, y: 0 },
  viewport: { x1: 0, x2: 0, y1: 0, y2: 0 },
  rect: {} as DOMRect,
  mousePosition: {
    grid: { x: Infinity, y: Infinity },
    screen: { x: Infinity, y: Infinity },
    browser: { x: Infinity, y: Infinity },
    isOutOfGrid: true,
  },
  setScroll: (position: Coordinates) => null,
  scrollDirection: "none" as "none" | "left" | "top" | "right" | "bottom",
  isScrolling: function () {
    return this.scrollDirection !== "none";
  },
  scene: "game" as "game" | "inventory" | "game-over",
  isPaused() {
    return this.scene !== "game";
  },
};

export const GameUIContext = React.createContext(gameUIContext);
export type GameUI = typeof gameUIContext;
