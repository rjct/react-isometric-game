import hummer from "@src/dict/vehicle/hummer";

export type VehicleDictEntity = {
  type: string;
  className: string;
  size: {
    grid: Size3D;
    screen: Size2D;
  };
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
