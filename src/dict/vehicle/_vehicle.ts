import hummer from "@src/dict/vehicle/hummer";

export type VehicleActionType = "none" | "idle" | "driving" | "collision";
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
  healthPoints: number;
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

export default function getVehiclesDictList() {
  return vehiclesList;
}

export function getVehicleDictEntityByType(type: VehicleType) {
  const vehiclesList = getVehiclesDictList();

  return vehiclesList[type];
}
