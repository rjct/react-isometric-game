import React from "react";

import { faLayerGroup } from "@fortawesome/free-solid-svg-icons/faLayerGroup";
import { faTreeCity } from "@fortawesome/free-solid-svg-icons/faTreeCity";
import { faPerson } from "@fortawesome/free-solid-svg-icons/faPerson";
import { faLightbulb } from "@fortawesome/free-solid-svg-icons/faLightbulb";

export const EditorModes = {
  terrain: { text: "Terrain", icon: faLayerGroup },
  building: { text: "Building", icon: faTreeCity },
  unit: { text: "Unit", icon: faPerson },
  light: { text: "Light", icon: faLightbulb },
};

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
  // eslint-disable-next-line  @typescript-eslint/no-unused-vars
  setScroll: (position: Coordinates) => null,
  scrollDirection: "none" as "none" | "left" | "top" | "right" | "bottom",
  isScrolling: function () {
    return this.scrollDirection !== "none";
  },
  scene: "game" as "editor" | "game" | "inventory" | "game-over",
  editorMode: "terrain" as keyof typeof EditorModes,
  isPaused() {
    return this.scene !== "game";
  },
};

export const GameUIContext = React.createContext(gameUIContext);
export type GameUI = typeof gameUIContext;
