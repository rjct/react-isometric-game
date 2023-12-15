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
  internalColor: "#00ff55",
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
      src: "/assets/vehicles/drivable/hummer/turn_on.mp3",
    },
    turnOff: {
      src: "/assets/vehicles/drivable/hummer/turn_off.mp3",
    },
    idle: {
      src: "/assets/vehicles/drivable/hummer/idle.mp3",
    },
    driving: {
      src: "/assets/vehicles/drivable/hummer/driving.mp3",
    },
    shiftIn: {
      src: "/assets/vehicles/drivable/hummer/shift_in.mp3",
    },
    shiftOut: {
      src: "/assets/vehicles/drivable/hummer/shift_out.mp3",
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
