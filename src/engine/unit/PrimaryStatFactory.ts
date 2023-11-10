import { UnitCharacteristicDictEntity } from "@src/dict/unit/_unit";
import { UnitPrimaryStatName, unitPrimaryStats } from "@src/dict/unit/_unitPrimaryStat";

export class PrimaryStat {
  public readonly dictEntity: UnitCharacteristicDictEntity;

  private _currentValue: number;
  private readonly _onUpdate: () => void;

  get value() {
    return this._currentValue;
  }
  set value(value: number) {
    this._currentValue = value;
    this._onUpdate();
  }

  constructor(
    public readonly name: UnitPrimaryStatName,
    initialValue: number,
    onUpdate: () => void,
  ) {
    this.dictEntity = unitPrimaryStats[this.name];
    this._currentValue = initialValue;
    this._onUpdate = onUpdate;
  }
}
