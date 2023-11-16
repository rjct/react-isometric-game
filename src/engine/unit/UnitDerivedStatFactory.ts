import { UnitCharacteristicDictEntity } from "@src/dict/unit/_unit";
import { UnitDerivedStatName, unitDerivedStats } from "@src/dict/unit/_unitDerivedStat";
import { UnitCharacteristics } from "@src/engine/unit/UnitCharacteristicsFactory";

export class UnitDerivedStat {
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
    public readonly name: UnitDerivedStatName,
    special: UnitCharacteristics["SPECIAL"],
  ) {
    this.dictEntity = unitDerivedStats[this.name];

    const initialValue = unitDerivedStats[this.name].calculateValue!(special);

    this._currentValue = initialValue;
    this._maxValue = initialValue;
  }

  updateCurrentValue(special: UnitCharacteristics["SPECIAL"]) {
    this._currentValue = unitDerivedStats[this.name].calculateValue!(special);
  }

  updateMaxValue(special: UnitCharacteristics["SPECIAL"]) {
    this._maxValue = unitDerivedStats[this.name].calculateValue!(special);
  }
}
