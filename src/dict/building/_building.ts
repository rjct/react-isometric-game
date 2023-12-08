import { BUILDING_DICT_DEFAULTS } from "@src/dict/building/constants";
import furniture from "@src/dict/building/furniture/_furniture";
import plant from "@src/dict/building/plant/_plant";
import road from "@src/dict/building/road/_road";
import vehicle from "@src/dict/building/vehicle/_vehicle";
import wall from "@src/dict/building/wall/_wall";
import { DictEntity } from "@src/dict/_dictEntity";

export type BuildingClass = keyof typeof BUILDING_DICT_DEFAULTS;

export interface BuildingDictEntity extends DictEntity {
  class: BuildingClass;
  type: string;
  className: string;
  variants: number;
  internalColor: string;
  occupiesCell: boolean;
  blocksRays: boolean;
}

const buildingsList = { ...vehicle, ...wall, ...furniture, ...road, ...plant } as const;

export type BuildingType = Exclude<keyof typeof buildingsList, number>;

export default function getBuildingsDictList() {
  return buildingsList;
}
