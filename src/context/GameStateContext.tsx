import React from "react";
import { GameMap, gameMap } from "../engine/GameMap";
import { BuildingTypes } from "../engine/BuildingFactory";
import unitTypes from "../dict/units.json";
import { TerrainAreaCoordinates, TerrainAreaType } from "../engine/TerrainAreaFactory";

export interface StaticMapTerrainArea {
  source: {
    type: TerrainAreaType;
    position: TerrainAreaCoordinates;
  };
  target: TerrainAreaCoordinates;
  exitUrl: string | null;
}

export interface StaticMap {
  size: Size;
  terrain: Array<StaticMapTerrainArea>;
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
}

export const GameStateContext = React.createContext<GameMap>(gameMap);
