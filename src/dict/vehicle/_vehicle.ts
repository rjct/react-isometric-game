import hummer from "@src/dict/vehicle/hummer";
import { VehicleDerivedStatName } from "@src/dict/vehicle/_vehicleDerivedStst";

export type VehicleActionType = "none" | "idle" | "driving" | "collision" | "hit" | "broken";
export type VehicleSfxType = "turnOn" | "turnOff" | "shiftIn" | "shiftOut" | VehicleActionType;
export type VehicleSfx = {
  [type in VehicleSfxType]: {
    src: string;
    timeIntervalMs?: number;
  };
};

export type VehicleDictEntity = {
  type: string;
  className: string;
  size: {
    grid: Size3D;
    screen: Size2D;
  };
  characteristics: {
    [characteristic in VehicleDerivedStatName]: number;
  };
  turningRadius: number;
  maxSpeed: number;
  explorable: boolean;
  animationDuration: {
    [action in VehicleActionType]?: number;
  };
  sfx: VehicleSfx;
};

const vehiclesList = { ...hummer } as const;

export type VehicleType = keyof typeof vehiclesList;

export type VehicleCharacteristicDictEntity = {
  title: string;
  description: string;
  suffix?: string;
};

export default function getVehiclesDictList() {
  return vehiclesList;
}

export function getVehicleDictEntityByType(type: VehicleType) {
  const vehiclesList = getVehiclesDictList();

  return vehiclesList[type];
}
