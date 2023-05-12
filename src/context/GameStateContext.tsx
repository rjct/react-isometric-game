import React from "react";
import { GameMap, gameMap } from "../engine/GameMap";
import { BuildingTypes } from "../engine/BuildingFactory";
import unitTypes from "../dict/units.json";

type StaticMapTerrainType = "earth" | "vault";
type StaticMapTerrainAreaCoordinates = { x1: number; y1: number; x2: number; y2: number };

export type StaticMap = {
  size: Size;
  terrain: {
    area: {
      source: {
        url: StaticMapTerrainType;
        position: StaticMapTerrainAreaCoordinates;
      };
      target: StaticMapTerrainAreaCoordinates;
    }[];
    single: {
      [coordinates: string]: {
        url: StaticMapTerrainType;
        position: Coordinates;
      };
    };
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
