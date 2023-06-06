import React from "react";
import { GameMap, gameMap } from "../engine/GameMap";
import { BuildingTypes } from "../engine/BuildingFactory";
import unitTypes from "../dict/units.json";
import { TerrainAreaType } from "../engine/TerrainAreaFactory";

export interface StaticMapTerrainArea {
  source: {
    type: TerrainAreaType;
    position: AreaCoordinates;
  };
  target: AreaCoordinates;
  exitUrl: string | null;
}

export interface StaticMapLight {
  position: Coordinates;
  color: string;
  radius: number;
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
  lights: StaticMapLight[];
}

export const GameStateContext = React.createContext<GameMap>(gameMap);
