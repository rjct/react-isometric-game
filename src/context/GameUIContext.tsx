import React from "react";

import { faCar } from "@fortawesome/free-solid-svg-icons/faCar";
import { faLayerGroup } from "@fortawesome/free-solid-svg-icons/faLayerGroup";
import { faLightbulb } from "@fortawesome/free-solid-svg-icons/faLightbulb";
import { faPerson } from "@fortawesome/free-solid-svg-icons/faPerson";
import { faTreeCity } from "@fortawesome/free-solid-svg-icons/faTreeCity";

export type GameScene =
  | "intro"
  | "mainMenu"
  | "unitCharacteristics"
  | "editor"
  | "loading"
  | "game"
  | "pause"
  | "settings"
  | "combat"
  | "inventory"
  | "inventoryTransfer"
  | "gameOver"
  | "debugSetting";

export const EditorModes = {
  terrain: { text: "Terrain", icon: faLayerGroup, tab: true },
  buildings: { text: "Building", icon: faTreeCity, tab: true },
  vehicles: { text: "Vehicles", icon: faCar, tab: true },
  units: { text: "Unit", icon: faPerson, tab: true },
  lights: { text: "Light", icon: faLightbulb, tab: true },
  manageInventory: { text: "Inventory", icon: faPerson, tab: false },
};

const gameUIContext = {
  keys: {} as { [code: KeyboardEvent["code"]]: boolean },
  scroll: { x: 0, y: 0 },
  viewport: {
    screen: { x1: 0, x2: 0, y1: 0, y2: 0 },
    grid: { x1: 0, x2: 0, y1: 0, y2: 0 },
    visibleCells: {} as { [key: string]: GridCoordinates },
  },
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
  isScrolling: false,
  scene: "intro" as GameScene,
  introSceneElapsedTime: 0,
  editorMode: "terrain" as keyof typeof EditorModes,
};

export const GameUIContext = React.createContext(gameUIContext);
export type GameUI = typeof gameUIContext;
