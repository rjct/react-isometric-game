import { DerivedStatFactory } from "@src/engine/unit/DerivedStatFactory";

export type UnitPrimaryStatName = keyof typeof UnitCharacteristics.prototype.SPECIAL;
export type UnitSkillName = keyof typeof UnitCharacteristics.prototype.skills;

export class UnitCharacteristics {
  // min=1, max=10
  SPECIAL = {
    strength: 5,
    perception: 5,
    endurance: 5,
    charisma: 5,
    intelligence: 5,
    agility: 5,
    luck: 5,
  };

  // in percent
  public skills = {
    // Combat skills
    smallGuns: 5 + 4 * this.SPECIAL.agility,
    bigGuns: 2 * this.SPECIAL.agility,
    energyWeapons: 2 * this.SPECIAL.agility,
    unarmed: 30 + 2 * (this.SPECIAL.strength + this.SPECIAL.agility),
    meleeWeapons: 20 + 2 * (this.SPECIAL.strength + this.SPECIAL.agility),
    throwing: 4 * this.SPECIAL.agility,

    // Active skills
    firstAid: 2 * (this.SPECIAL.perception + this.SPECIAL.intelligence),
    doctor: 5 + this.SPECIAL.perception + this.SPECIAL.intelligence,
    sneak: 5 + 3 * this.SPECIAL.agility,
    lockpick: 10 + this.SPECIAL.perception + this.SPECIAL.agility,
    steal: 3 * this.SPECIAL.agility,
    traps: 10 + this.SPECIAL.perception + this.SPECIAL.agility,
    science: 4 * this.SPECIAL.intelligence,
    repair: 3 * this.SPECIAL.intelligence,

    // Passive skills
    speech: 5 * this.SPECIAL.charisma,
    barter: 4 * this.SPECIAL.charisma,
    gambling: 5 * this.SPECIAL.luck,
    outdoorsman: 2 * (this.SPECIAL.endurance + this.SPECIAL.intelligence),
  };

  /*
   * Derived statistics
   */
  actionPoints = new DerivedStatFactory(Math.floor(this.SPECIAL.agility / 2) + 5);
  armorClass = this.SPECIAL.agility;
  carryWeight = 25 + this.SPECIAL.strength * 25;
  criticalChance = (1 / this.SPECIAL.luck) * 100;
  damageResistance = 0;
  healingRate = Math.min(1, (1 / 3) * this.SPECIAL.endurance);
  healthPoints = new DerivedStatFactory(15 + this.SPECIAL.strength + this.SPECIAL.endurance * 2);
  meleeDamage = Math.max(1, this.SPECIAL.strength - 5);
  skillRate = this.SPECIAL.intelligence * 2 + 5;

  constructor() {
    //
  }

  getLevelByXP(xp: number): number {
    //
    // (n*(n-1)/2) * 1,000 XP
    //

    const levelTable = [
      0, 1000, 3000, 6000, 10000, 15000, 21000, 28000, 36000, 45000, 55000, 66000, 78000, 91000, 105000, 120000, 136000,
      153000, 171000, 190000, 210000,
    ];

    for (let level = 1; level <= levelTable.length; level++) {
      if (xp < levelTable[level]) {
        return level;
      }
    }

    // If the provided XP is greater than the maximum level, return -1 or an appropriate value.
    return -1;
  }
}
