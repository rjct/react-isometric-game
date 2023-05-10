import buildings from "../dict/buildings.json";

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

export class Building {
  public readonly type;
  public readonly id;
  public readonly className;

  position = { x: 0, y: 0 };
  direction: Direction = "top";
  public readonly variants;
  variant = 0;

  size = {
    grid: { width: 1, height: 1 },
    screen: { width: 0, height: 0 },
  };
  private readonly ref: DictBuilding;
  constructor(props: { buildingType: BuildingType; position: Coordinates; direction: Direction; variant: number }) {
    this.ref = { ...buildings[props.buildingType] } as typeof this.ref;

    this.id = crypto.randomUUID();
    this.type = props.buildingType;
    this.className = ["building", this.ref.className].join(" ");
    this.direction = props.direction;
    this.variants = this.ref.variants;
    this.variant = props.variant;
    this.position = props.position;
    this.size = this.getSizeByPositionAndDirection(this.ref.size);
  }

  private getSizeByPositionAndDirection(size: BuildingSize) {
    return ["left", "right"].includes(this.direction)
      ? { ...size, ...{ grid: { width: size.grid.height, height: size.grid.width } } }
      : size;
  }

  public setDirection(direction: Direction) {
    this.direction = direction;
    this.size = this.getSizeByPositionAndDirection(this.ref.size);
  }

  public setVariant(variant: number) {
    this.variant = variant;
  }

  public getAvailableDirections() {
    return this.ref.directions;
  }

  public getAvailableVariants() {
    return [...Array(this.ref.variants).keys()];
  }
}

export type BuildingTypes = typeof buildings;
