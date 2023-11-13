import ghoul from "@src/dict/unit/ghoul";
import vault13_male from "@src/dict/unit/vault13_male";
import { WeaponAttackMode } from "@src/dict/weapon/weapon";
import { UnitCharacteristics } from "@src/engine/unit/UnitCharacteristicsFactory";

export type UnitSfxType = "walkStep" | "hit" | "dead";
export type UnitSfxEntity = {
  src: string[];
  repeatEveryMs?: number;
};
export type UnitSfx = {
  [type in UnitSfxType]: UnitSfxEntity;
};

export type UnitActionType =
  | "none"
  | "idle"
  | "explore"
  | "walk"
  | "run"
  | "hit"
  | "dead"
  | "fall"
  | "standup"
  | "die"
  | WeaponAttackMode;

export type UnitDictEntity = {
  type: string;
  className: string;
  explorable: boolean;
  speed: {
    walk: number;
    run: number;
  };
  coolDownTime: number;
  size: {
    grid: Size3D;
    screen: Size2D;
  };
  healthPoints: {
    current: number;
    max: number;
  };
  actionPoints: {
    max: number;
    consumption: {
      [type in UnitActionType]?: number;
    };
  };
  rewardXpPoints: number;
  fieldOfView: {
    sectorAngle: AngleInDegrees;
    range: number;
  };
  animationDuration: {
    hit: 400;
    notAllowed: 1000;
  };
  sfx: UnitSfx;
};

const unitsList = { ...vault13_male, ...ghoul } as const;

export type UnitType = Exclude<keyof typeof unitsList, number>;

export type UnitCharacteristicDictEntity = {
  title: string;
  description: string;
  calculateValue?: (special: UnitCharacteristics["SPECIAL"]) => number;
  suffix?: string;
};

export default function getUnitsDictList() {
  return unitsList;
}

export function getUnitDictEntityByType(type: UnitType) {
  const unitsList = getUnitsDictList();

  return unitsList[type];
}
