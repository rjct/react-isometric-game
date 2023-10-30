import unitTypes from "@src/dict/units.json";
import React from "react";

import { AmmoName, WeaponAmmoClass } from "@src/dict/ammo/ammo";
import { VehicleType } from "@src/dict/vehicle/vehicle";
import { WeaponName } from "@src/dict/weapon/weapon";

import { BuildingType } from "@src/dict/building/building";
import { gameMap, GameMap } from "@src/engine/gameMap";
import { TerrainAreaType } from "@src/engine/terrain/TerrainAreaFactory";
import { Unit } from "@src/engine/unit/UnitFactory";

export interface StaticMapTerrainArea {
  source: {
    type: TerrainAreaType;
    position: AreaCoordinates;
  };
  target: AreaCoordinates;
  exitUrl: string | null;
  visibility?: boolean | null;
}

export interface StaticMapInventory {
  main?: Array<StaticMapWeapon | StaticMapWeaponAmmo>;
  leftHand?: StaticMapWeapon;
  rightHand?: StaticMapWeapon;
}

export interface StaticMapBuilding {
  type: BuildingType;
  position: GridCoordinates;
  rotation: AngleInDegrees;
  variant: number;
  occupiesCell?: boolean;
  inventory?: StaticMapInventory;
}

export interface StaticMapVehicle {
  type: VehicleType;
  position: GridCoordinates;
  rotation: AngleInDegrees;
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
  rotation?: AngleInDegrees;
  inventory?: StaticMapInventory;
  healthPoints?: Unit["healthPoints"];
  randomActions?: Array<"roam" | "idle">;
}

export interface StaticMapWeapon {
  class: "weapon";
  name: WeaponName;
  quantity?: number;
}

export interface StaticMapWeaponAmmo {
  class: WeaponAmmoClass;
  name: AmmoName;
  quantity?: number;
}

export interface StaticMap {
  size: Size2D;
  terrain: Array<StaticMapTerrainArea>;
  hero: Omit<StaticMapUnit, "type">;
  buildings: Array<StaticMapBuilding>;
  vehicles: Array<StaticMapVehicle>;
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
