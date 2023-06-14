import React from "react";
import { GameMap, gameMap } from "../engine/GameMap";
import { BuildingTypes } from "../engine/BuildingFactory";
import unitTypes from "../dict/units.json";
import { TerrainAreaType } from "../engine/TerrainAreaFactory";
import { WeaponClass, WeaponType } from "../engine/weapon/WeaponFactory";
import { AmmoClass, AmmoType } from "../engine/weapon/AmmoFactory";

export interface StaticMapTerrainArea {
  source: {
    type: TerrainAreaType;
    position: AreaCoordinates;
  };
  target: AreaCoordinates;
  exitUrl: string | null;
}

export interface StaticMapBuilding {
  type: keyof BuildingTypes;
  position: GridCoordinates;
  direction: Direction;
  variant: number;
}

export interface StaticMapLight {
  position: GridCoordinates;
  color: string;
  radius: number;
}

export interface StaticMapUnit {
  type?: keyof typeof unitTypes;
  position: GridCoordinates;
  inventory?: {
    backpack?: StaticMapWeapon[];
    leftHand?: StaticMapWeapon;
    rightHand?: StaticMapWeapon;
  };
}

export interface StaticMapWeapon {
  class: WeaponClass;
  type: WeaponType;
  ammo?: StaticMapWeaponAmmo;
}

export interface StaticMapWeaponAmmo {
  class: AmmoClass;
  type: AmmoType;
  quantity: number;
}

export interface StaticMap {
  size: Size;
  terrain: Array<StaticMapTerrainArea>;
  hero: Omit<StaticMapUnit, "type">;
  buildings: Array<StaticMapBuilding>;
  enemies: Array<StaticMapUnit>;
  shadows: {
    color: string;
    opacity: number;
  };
  lights: StaticMapLight[];
}

export const GameStateContext = React.createContext<GameMap>(gameMap);
