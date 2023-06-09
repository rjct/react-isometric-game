import buildings from "../dict/buildings.json";
import { GameObjectFactory } from "./GameObjectFactory";
import { StaticMapBuilding } from "../context/GameStateContext";

type BuildingSize = {
  grid: Size;
  screen: Size;
};

export type BuildingType = keyof typeof buildings;

export type BuildingClass = "wall" | "vehicle" | "furniture";

export interface DictBuilding {
  class: BuildingClass;
  type: keyof typeof buildings;
  className: string;
  size: BuildingSize;
  directions: Direction[];
  variants: number;
}

export type DictBuildings = {
  [buildingType in BuildingType]: DictBuilding;
};

export class Building extends GameObjectFactory {
  public readonly class;
  public readonly type;

  public readonly className;
  public readonly variants;
  variant = 0;

  private readonly ref: DictBuilding;

  constructor(props: {
    buildingType: BuildingType;
    position: GridCoordinates;
    direction: Direction;
    variant: number;
    occupiesCell: boolean;
  }) {
    const ref = { ...buildings[props.buildingType] } as DictBuilding;
    const size = Building.getSizeByPositionAndDirection(ref.size, props.direction);

    super({ size, position: props.position, direction: props.direction, internalColor: "rgba(255,232,0,0.5)" });

    this.ref = ref;

    this.class = ref.class;
    this.type = props.buildingType;
    this.className = ["building", this.ref.className].join(" ");

    this.variants = this.ref.variants;
    this.variant = props.variant;

    this.occupiesCell = props.occupiesCell;
  }

  private static getSizeByPositionAndDirection(size: BuildingSize, direction: Direction) {
    return ["left", "right"].includes(direction)
      ? {
          ...size,
          ...{
            grid: { width: size.grid.height, height: size.grid.width },
            //screen: { width: size.screen.height, height: size.screen.width },
          },
        }
      : size;
  }

  public setDirection(direction: Direction) {
    this.direction = direction;
    this.size = Building.getSizeByPositionAndDirection(this.ref.size, direction);
    this.createWalls();
  }

  public setVariant(variant: number) {
    this.variant = variant;
  }

  public getAvailableDirections() {
    return this.ref.directions;
  }

  public getJSON() {
    const json = {
      type: this.type,
      position: this.getRoundedPosition(),
      direction: this.direction,
      variant: this.variant,
    } as StaticMapBuilding;

    if (!this.occupiesCell) {
      json.occupiesCell = false;
    }

    return json;
  }
}

export type BuildingTypes = typeof buildings;
