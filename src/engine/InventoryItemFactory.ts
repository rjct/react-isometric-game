import { Building } from "@src/engine/BuildingFactory";
import { Unit } from "@src/engine/unit/UnitFactory";

export class InventoryItem {
  public owner: Unit | Building | null = null;
  constructor() {
    //
  }

  assignOwner(owner: Unit | Building) {
    this.owner = owner;
  }

  unAssignOwner() {
    this.owner = null;
  }
}
