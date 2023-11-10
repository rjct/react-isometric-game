import { UnitDerivedStatName, unitDerivedStats } from "@src/dict/unit/_unitDerivedStat";
import { UnitPrimaryStatName, unitPrimaryStats } from "@src/dict/unit/_unitPrimaryStat";
import { UnitSkillName, unitSkills } from "@src/dict/unit/_unitSkills";
import { DerivedStat } from "@src/engine/unit/DerivedStatFactory";
import { PrimaryStat } from "@src/engine/unit/PrimaryStatFactory";
import { Skill } from "@src/engine/unit/SkillFactory";

export class UnitCharacteristics {
  // XP
  private _experiencePoints = 0;

  get xp() {
    return this._experiencePoints;
  }

  // Level
  get level() {
    return Math.floor((Math.sqrt(1 + 8 * (this.xp / 1000)) - 1) / 2) + 1;
  }

  // SPECIAL
  private _availablePoints = 5;

  SPECIAL = {
    strength: new PrimaryStat("strength", 5, this._recalc.bind(this)),
    perception: new PrimaryStat("perception", 5, this._recalc.bind(this)),
    endurance: new PrimaryStat("endurance", 5, this._recalc.bind(this)),
    charisma: new PrimaryStat("charisma", 5, this._recalc.bind(this)),
    intelligence: new PrimaryStat("intelligence", 5, this._recalc.bind(this)),
    agility: new PrimaryStat("agility", 5, this._recalc.bind(this)),
    luck: new PrimaryStat("luck", 5, this._recalc.bind(this)),
  };

  get availablePoints() {
    return this._availablePoints;
  }
  set availablePoints(value: number) {
    this._availablePoints = value;
  }

  /*
   * SKILLS
   */
  private _availableSkillPoints = 3;
  get availableSkillPoints() {
    return this._availableSkillPoints;
  }
  set availableSkillPoints(value: number) {
    this._availableSkillPoints = value;
  }

  skills = {
    // Combat skills
    smallGuns: new Skill("smallGuns", this.SPECIAL),
    bigGuns: new Skill("bigGuns", this.SPECIAL),
    energyWeapons: new Skill("energyWeapons", this.SPECIAL),
    unarmed: new Skill("unarmed", this.SPECIAL),
    meleeWeapons: new Skill("meleeWeapons", this.SPECIAL),
    throwing: new Skill("throwing", this.SPECIAL),
    // Active skills
    firstAid: new Skill("firstAid", this.SPECIAL),
    doctor: new Skill("doctor", this.SPECIAL),
    sneak: new Skill("sneak", this.SPECIAL),
    lockpick: new Skill("lockpick", this.SPECIAL),
    steal: new Skill("steal", this.SPECIAL),
    traps: new Skill("traps", this.SPECIAL),
    science: new Skill("science", this.SPECIAL),
    repair: new Skill("repair", this.SPECIAL),
    // Passive skills
    pilot: new Skill("pilot", this.SPECIAL),
    barter: new Skill("barter", this.SPECIAL),
    gambling: new Skill("gambling", this.SPECIAL),
    outdoorsman: new Skill("outdoorsman", this.SPECIAL),
  };

  /*
   * Derived statistics
   */
  derived = {
    actionPoints: new DerivedStat("actionPoints", this.SPECIAL),
    armorClass: new DerivedStat("armorClass", this.SPECIAL),
    carryWeight: new DerivedStat("carryWeight", this.SPECIAL),
    criticalChance: new DerivedStat("criticalChance", this.SPECIAL),
    damageResistance: new DerivedStat("damageResistance", this.SPECIAL),
    healingRate: new DerivedStat("healingRate", this.SPECIAL),
    healthPoints: new DerivedStat("healthPoints", this.SPECIAL),
    meleeDamage: new DerivedStat("meleeDamage", this.SPECIAL),
    skillRate: new DerivedStat("skillRate", this.SPECIAL),
  };

  constructor() {
    //
  }

  private _recalc() {
    this._updateDerivedStats();
    this._updateSkills();
  }

  private _updateDerivedStats() {
    Object.keys(unitDerivedStats).forEach((stat) => {
      const key = stat as UnitDerivedStatName;

      this.derived[key].updateCurrentValue(this.SPECIAL);
      this.derived[key].updateMaxValue(this.SPECIAL);
    });
  }

  _updateSkills() {
    Object.keys(unitSkills).forEach((stat) => {
      const key = stat as UnitSkillName;

      this.skills[key].updateCurrentValue(this.SPECIAL);
    });
  }

  static getDictEntityByName(stat: UnitPrimaryStatName | UnitSkillName | UnitDerivedStatName | null) {
    return (
      unitPrimaryStats[stat as UnitPrimaryStatName] ||
      unitSkills[stat as UnitSkillName] ||
      unitDerivedStats[stat as UnitDerivedStatName]
    );
  }
}
