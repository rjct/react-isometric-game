import React from "react";

import { faLayerGroup } from "@fortawesome/free-solid-svg-icons/faLayerGroup";
import { faTreeCity } from "@fortawesome/free-solid-svg-icons/faTreeCity";
import { faPerson } from "@fortawesome/free-solid-svg-icons/faPerson";
import { faLightbulb } from "@fortawesome/free-solid-svg-icons/faLightbulb";

export type GameScene = "editor" | "loading" | "game" | "combat" | "inventory" | "gameOver";

export const EditorModes = {
  terrain: { text: "Terrain", icon: faLayerGroup },
  buildings: { text: "Building", icon: faTreeCity },
  units: { text: "Unit", icon: faPerson },
  lights: { text: "Light", icon: faLightbulb },
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
  setScroll: (position: ScreenCoordinates) => null,
  scrollDirection: "none" as "none" | "left" | "top" | "right" | "bottom",
  isScrolling: function () {
    return this.scrollDirection !== "none";
  },
  scene: "game" as GameScene,
  editorMode: "terrain" as keyof typeof EditorModes,
  offscreenCanvasRenderingProgress: {
    lightsAndShadows: {
      percent: 100,
      complete: true,
    } as Omit<OffscreenCanvasRenderingProgress, "data">,
  },
};

export const GameUIContext = React.createContext(gameUIContext);
export type GameUI = typeof gameUIContext;
