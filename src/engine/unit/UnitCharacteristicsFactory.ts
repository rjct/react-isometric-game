import { UnitDerivedStatName, unitDerivedStats } from "@src/dict/unit/_unitDerivedStat";
import { UnitSkillName, unitSkills } from "@src/dict/unit/_unitSkills";
import { UnitDerivedStat } from "@src/engine/unit/UnitDerivedStatFactory";
import { UnitPrimaryStat } from "@src/engine/unit/UnitPrimaryStatFactory";
import { UnitSkill } from "@src/engine/unit/UnitSkillFactory";

export class UnitCharacteristics {
  // XP
  private _experiencePoints = 0;

  get xp() {
    return this._experiencePoints;
  }

  get levelProgressInPercent() {
    const currentLevel = this.level;
    const currentLevelXp = currentLevel * (currentLevel - 1) * 500;
    const nextLevelXp = (currentLevel + 1) * currentLevel * 500;
    const xpForNextLevel = nextLevelXp - currentLevelXp;
    const xpProgress = this.xp - currentLevelXp;

    return (xpProgress / xpForNextLevel) * 100;
  }

  // Level
  get level() {
    return Math.floor((Math.sqrt(1 + 8 * (this.xp / 1000)) - 1) / 2) + 1;
  }

  // SPECIAL
  private _availablePoints = 5;

  SPECIAL = {
    strength: new UnitPrimaryStat("strength", 5, this._recalc.bind(this)),
    perception: new UnitPrimaryStat("perception", 5, this._recalc.bind(this)),
    endurance: new UnitPrimaryStat("endurance", 5, this._recalc.bind(this)),
    charisma: new UnitPrimaryStat("charisma", 5, this._recalc.bind(this)),
    intelligence: new UnitPrimaryStat("intelligence", 5, this._recalc.bind(this)),
    agility: new UnitPrimaryStat("agility", 5, this._recalc.bind(this)),
    luck: new UnitPrimaryStat("luck", 5, this._recalc.bind(this)),
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
    smallGuns: new UnitSkill("smallGuns", this.SPECIAL),
    bigGuns: new UnitSkill("bigGuns", this.SPECIAL),
    energyWeapons: new UnitSkill("energyWeapons", this.SPECIAL),
    unarmed: new UnitSkill("unarmed", this.SPECIAL),
    meleeWeapons: new UnitSkill("meleeWeapons", this.SPECIAL),
    throwing: new UnitSkill("throwing", this.SPECIAL),
    // Active skills
    firstAid: new UnitSkill("firstAid", this.SPECIAL),
    doctor: new UnitSkill("doctor", this.SPECIAL),
    sneak: new UnitSkill("sneak", this.SPECIAL),
    lockpick: new UnitSkill("lockpick", this.SPECIAL),
    steal: new UnitSkill("steal", this.SPECIAL),
    traps: new UnitSkill("traps", this.SPECIAL),
    science: new UnitSkill("science", this.SPECIAL),
    repair: new UnitSkill("repair", this.SPECIAL),
    // Passive skills
    pilot: new UnitSkill("pilot", this.SPECIAL),
    barter: new UnitSkill("barter", this.SPECIAL),
    gambling: new UnitSkill("gambling", this.SPECIAL),
    outdoorsman: new UnitSkill("outdoorsman", this.SPECIAL),
  };

  /*
   * Derived statistics
   */
  derived = {
    actionPoints: new UnitDerivedStat("actionPoints", this.SPECIAL),
    armorClass: new UnitDerivedStat("armorClass", this.SPECIAL),
    carryWeight: new UnitDerivedStat("carryWeight", this.SPECIAL),
    criticalChance: new UnitDerivedStat("criticalChance", this.SPECIAL),
    damageResistance: new UnitDerivedStat("damageResistance", this.SPECIAL),
    healingRate: new UnitDerivedStat("healingRate", this.SPECIAL),
    healthPoints: new UnitDerivedStat("healthPoints", this.SPECIAL),
    meleeDamage: new UnitDerivedStat("meleeDamage", this.SPECIAL),
    skillRate: new UnitDerivedStat("skillRate", this.SPECIAL),
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

  earnXp(value: number) {
    this._experiencePoints += value;
  }
}
