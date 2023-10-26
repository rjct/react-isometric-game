import { Building } from "@src/engine/BuildingFactory";
import { Unit } from "@src/engine/unit/UnitFactory";
import { Vehicle } from "@src/engine/vehicle/VehicleFactory";

export class InventoryItem {
  public owner: Unit | Building | Vehicle | null = null;
  constructor() {
    //
  }

  assignOwner(owner: Unit | Building | Vehicle) {
    this.owner = owner;
  }

  unAssignOwner() {
    this.owner = null;
  }
}
