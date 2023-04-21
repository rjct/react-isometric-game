import { nanoid } from "nanoid";
import buildings from "../dict/buildings.json";

export const genericBuilding = {
  id: "",
  selectable: false,
  className: "building",

  position: { x: 0, y: 0 },

  size: {
    grid: { width: 0, height: 0 },
    screen: { width: 0, height: 0 },
  },
};

export class Building {
  id = "";
  selectable = false;
  className = "building";

  position = { x: 0, y: 0 };

  size = {
    grid: { width: 1, height: 1 },
    screen: { width: 0, height: 0 },
  };
  constructor(buildingType: keyof typeof buildings, position: Coordinates) {
    const ref = buildings[buildingType];

    this.id = nanoid();
    this.size = ref.size;
    this.className = ref.className;
    this.size = ref.size;
    this.position = position;
  }
}

export type BuildingType = typeof genericBuilding;
export type BuildingTypes = typeof buildings;
