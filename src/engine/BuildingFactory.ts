import buildings from "../dict/buildings.json";
import { GameObjectFactory } from "./GameObjectFactory";

type BuildingSize = {
  grid: Size;
  screen: Size;
};

export type BuildingType = keyof typeof buildings;

export interface DictBuilding {
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
  public readonly type;

  public readonly className;

  public readonly variants;
  variant = 0;

  private readonly ref: DictBuilding;

  constructor(props: { buildingType: BuildingType; position: GridCoordinates; direction: Direction; variant: number }) {
    const ref = { ...buildings[props.buildingType] } as DictBuilding;
    const size = Building.getSizeByPositionAndDirection(ref.size, props.direction);

    super({ size, position: props.position, direction: props.direction });

    this.ref = ref;

    this.type = props.buildingType;
    this.className = ["building", this.ref.className].join(" ");

    this.variants = this.ref.variants;
    this.variant = props.variant;
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
  }

  public setVariant(variant: number) {
    this.variant = variant;
  }

  public setPosition(coordinates: GridCoordinates) {
    this.position = coordinates;
  }

  public getAvailableDirections() {
    return this.ref.directions;
  }

  public getAvailableVariants() {
    return [...Array(this.ref.variants).keys()];
  }
}

export type BuildingTypes = typeof buildings;
