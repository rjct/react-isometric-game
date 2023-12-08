import { VehicleDictEntity } from "@src/dict/vehicle/_vehicle";
import { generateInitialClipPathObj } from "@src/dict/_dictEntity";

const vehicleType = "hummer";
const rotationAngles = [...Array.from({ length: 32 }).fill(0)].map((_iter, index) => {
  return index * 11.25;
});

const hummer: VehicleDictEntity = {
  interfaceType: "vehicle",
  type: vehicleType,
  className: vehicleType,
  rotationAngles,
  size: {
    grid: {
      width: 4,
      height: 1,
      length: 4,
    },
    screen: {
      width: 236,
      height: 236,
    },
  },
  characteristics: {
    healthPoints: 3000,
    carryWeight: 500,
    armorClass: 30,
  },
  turningRadius: 2,
  maxSpeed: 10,
  lootable: true,
  animationDuration: {
    collision: 1000,
  },
  sfx: {
    none: {
      src: "",
    },
    turnOn: {
      src: "public/assets/vehicles/drivable/hummer/turn_on.mp3",
    },
    turnOff: {
      src: "public/assets/vehicles/drivable/hummer/turn_off.mp3",
    },
    idle: {
      src: "public/assets/vehicles/drivable/hummer/idle.mp3",
    },
    driving: {
      src: "public/assets/vehicles/drivable/hummer/driving.mp3",
    },
    shiftIn: {
      src: "public/assets/vehicles/drivable/hummer/shift_in.mp3",
    },
    shiftOut: {
      src: "public/assets/vehicles/drivable/hummer/shift_out.mp3",
    },
    collision: {
      src: "",
    },
    hit: {
      src: "",
    },
    broken: {
      src: "",
    },
  },
  clipPath: generateInitialClipPathObj(
    rotationAngles,
    ["none"],
    (variant) => `vehicles/drivable/${vehicleType}/${variant}.webp`,
  ),
};

export default {
  hummer,
};
