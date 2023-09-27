import unitTypes from "@src/dict/units.json";
import React from "react";

import { BuildingTypes } from "@src/engine/BuildingFactory";
import { gameMap, GameMap } from "@src/engine/gameMap";
import { TerrainAreaType } from "@src/engine/terrain/TerrainAreaFactory";
import { AmmoClass, AmmoType } from "@src/engine/weapon/AmmoFactory";
import { WeaponClass, WeaponType } from "@src/engine/weapon/WeaponFactory";

export interface StaticMapTerrainArea {
  source: {
    type: TerrainAreaType;
    position: AreaCoordinates;
  };
  target: AreaCoordinates;
  exitUrl: string | null;
  visibility?: boolean | null;
}

export interface StaticMapBuilding {
  type: keyof BuildingTypes;
  position: GridCoordinates;
  direction: Direction;
  variant: number;
  occupiesCell?: boolean;
}

export interface StaticMapLight {
  position: GridCoordinates;
  color: string;
  radius: number;
}

export interface StaticMapUnit {
  type?: keyof typeof unitTypes;
  position: GridCoordinates;
  isDead?: boolean;
  direction?: Direction;
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
  size: Size2D;
  terrain: Array<StaticMapTerrainArea>;
  hero: Omit<StaticMapUnit, "type">;
  buildings: Array<StaticMapBuilding>;
  enemies: Array<StaticMapUnit>;
  globalShadows: {
    color: string;
    opacity: number;
  };
  globalLights: {
    opacity: number;
  };
  lights: StaticMapLight[];
}

export const GameStateContext = React.createContext<GameMap>(gameMap);
