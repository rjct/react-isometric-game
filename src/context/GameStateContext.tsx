import React from "react";
import { GameMap } from "../engine/GameMap";
import { BuildingTypes } from "../engine/BuildingFactory";
import unitTypes from "../dict/units.json";

export type StaticMap = {
  size: Size;
  terrain: {
    className: "earth";
    rows: 1;
    columns: 1;
  };
  heroStartPosition: Coordinates;
  buildings: {
    id: keyof BuildingTypes;
    position: Coordinates;
  }[];
  enemies: {
    id: keyof typeof unitTypes;
    position: Coordinates;
  }[];
  exitPoints: ExitPoint[];
};

export const GameStateContext = React.createContext<typeof GameMap>(GameMap);
