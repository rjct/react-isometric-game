import { UnitCharacteristicDictEntity } from "@src/dict/unit/_unit";
import { UnitSkillName, unitSkills } from "@src/dict/unit/_unitSkills";
import { UnitCharacteristics } from "@src/engine/unit/UnitCharacteristicsFactory";

export class Skill {
  public readonly dictEntity: UnitCharacteristicDictEntity;
  private _minValue: number;
  private _currentValue: number;

  get min() {
    return this._minValue;
  }

  get value() {
    return this._currentValue;
  }

  set value(value: number) {
    this._currentValue = value;
  }

  constructor(
    public readonly name: UnitSkillName,
    special: UnitCharacteristics["SPECIAL"],
  ) {
    this.name = name;
    this.dictEntity = unitSkills[this.name];

    this._currentValue = unitSkills[this.name].calculateValue!(special);
    this._minValue = this._currentValue;
  }

  updateCurrentValue(special: UnitCharacteristics["SPECIAL"]) {
    this._currentValue = unitSkills[this.name].calculateValue!(special);
  }
}
