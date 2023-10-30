import { BuildingDictEntity } from "@src/dict/building/building";
import vehicle_2x1 from "@src/dict/building/vehicle/vehicle_2x1";
import vehicle_2x4 from "@src/dict/building/vehicle/vehicle_2x4";
import vehicle_2x6 from "@src/dict/building/vehicle/vehicle_2x6";
import vehicle_3x2 from "@src/dict/building/vehicle/vehicle_3x2";
import vehicle_3x4 from "@src/dict/building/vehicle/vehicle_3x4";
import vehicle_4x4 from "@src/dict/building/vehicle/vehicle_4x4";

export const vehicle: { [id: string]: BuildingDictEntity } = {
  vehicle_2x1,
  vehicle_2x4,
  vehicle_2x6,
  vehicle_3x2,
  vehicle_3x4,
  vehicle_4x4,
};

export default vehicle;
