import { VehicleCharacteristicDictEntity } from "@src/dict/vehicle/_vehicle";

export type VehicleDerivedStatName = "armorClass" | "carryWeight" | "healthPoints";

export const vehicleDerivedStats: { [p in VehicleDerivedStatName]: VehicleCharacteristicDictEntity } = {
  healthPoints: {
    title: "Health Points",
    description: "How much damage the vehicle can take before dying.",
    suffix: "",
  },
  carryWeight: {
    title: "Carry Weight",
    description: "How much equipment can be carried.",
    suffix: "lbs",
  },
  armorClass: {
    title: "Armor Class",
    description: "How likely the vehicle is to avoid getting hit (the higher, the better).",
    suffix: "",
  },
};
