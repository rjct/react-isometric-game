import { UnitCharacteristicDictEntity } from "@src/dict/unit/_unit";
import { VehicleDerivedStatName, vehicleDerivedStats } from "@src/dict/vehicle/_vehicleDerivedStst";

export class VehicleDerivedStat {
  public readonly dictEntity: UnitCharacteristicDictEntity;

  private _currentValue: number;
  private _maxValue: number;

  get value() {
    return this._currentValue;
  }

  set value(value: number) {
    this._currentValue = value;
  }

  get max() {
    return this._maxValue;
  }

  constructor(
    public readonly name: VehicleDerivedStatName,
    initialValue: number,
  ) {
    this.dictEntity = vehicleDerivedStats[this.name];

    this._currentValue = initialValue;
    this._maxValue = initialValue;
  }
}
