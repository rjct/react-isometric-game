import React from "react";
import { GameMap, gameMap } from "../engine/GameMap";
import { BuildingTypes } from "../engine/BuildingFactory";
import unitTypes from "../dict/units.json";

export type StaticMap = {
  size: Size;
  terrain: {
    className: "earth" | "vault";
    rows: number;
    columns: number;
  };
  heroStartPosition: Coordinates;
  buildings: {
    type: keyof BuildingTypes;
    position: Coordinates;
    direction: Direction;
    variant: number;
  }[];
  enemies: {
    type: keyof typeof unitTypes;
    position: Coordinates;
  }[];
  exitPoints: ExitPoint[];
};

export const GameStateContext = React.createContext<GameMap>(gameMap);
