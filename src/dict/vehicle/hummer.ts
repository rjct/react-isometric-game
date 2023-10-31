import { VehicleDictEntity } from "@src/dict/vehicle/_vehicle";

const hummer: VehicleDictEntity = {
  type: "hummer",
  className: "hummer",
  size: {
    grid: {
      width: 4,
      height: 1,
      length: 4,
    },
    screen: {
      width: 180,
      height: 144,
    },
  },
  turningRadius: 2,
  maxSpeed: 10,
  sfx: {
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
  },
};

export default {
  hummer,
};
