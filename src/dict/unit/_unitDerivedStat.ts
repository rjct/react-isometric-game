import { UnitCharacteristicDictEntity } from "@src/dict/unit/_unit";
import { UnitCharacteristics } from "@src/engine/unit/UnitCharacteristicsFactory";

export type UnitDerivedStatName =
  | "actionPoints"
  | "armorClass"
  | "carryWeight"
  | "criticalChance"
  | "damageResistance"
  | "healingRate"
  | "healthPoints"
  | "meleeDamage"
  | "skillRate";

export const unitDerivedStats: { [p in UnitDerivedStatName]: UnitCharacteristicDictEntity } = {
  actionPoints: {
    title: "Action Points",
    description: "Number of actions that can be performed in a single turn.",
    calculateValue: (special: UnitCharacteristics["SPECIAL"]) => {
      return Math.floor(special.agility.value / 2) + 5;
    },
    suffix: "",
  },
  armorClass: {
    title: "Armor Class",
    description: "How likely the character is to avoid getting hit (the higher, the better).",
    calculateValue: (special: UnitCharacteristics["SPECIAL"]) => {
      return special.agility.value;
    },
    suffix: "",
  },
  carryWeight: {
    title: "Carry Weight",
    description: "How much equipment can be carried.",
    calculateValue: (special: UnitCharacteristics["SPECIAL"]) => {
      return 25 + special.strength.value * 25;
    },
    suffix: "lbs",
  },

  criticalChance: {
    title: "Critical Chance",
    description: "The base chance you will cause a critical hit with an attack.",
    calculateValue: (special: UnitCharacteristics["SPECIAL"]) => {
      return Math.min(0, (1 / special.luck.value) * 100);
    },
    suffix: "%",
  },
  damageResistance: {
    title: "Damage Resistance",
    description: "Reduces physical damage by a percentage.",
    calculateValue: (special: UnitCharacteristics["SPECIAL"]) => {
      return 0;
    },
    suffix: "%",
  },
  healingRate: {
    title: "Healing Rate",
    description: "How fast you regain health, both by yourself and by being healed.",
    calculateValue: (special: UnitCharacteristics["SPECIAL"]) => {
      return Number(Math.min(1, (1 / 3) * special.endurance.value).toFixed(2));
    },
    suffix: "",
  },
  healthPoints: {
    title: "Health Points",
    description: "How much damage the character can take before dying.",
    calculateValue: (special: UnitCharacteristics["SPECIAL"]) => {
      return 15 + special.strength.value + special.endurance.value * 2;
    },
    suffix: "",
  },
  meleeDamage: {
    title: "Melee Damage",
    description: "Base amount of damage the character does in hand-to-hand combat.",
    calculateValue: (special: UnitCharacteristics["SPECIAL"]) => {
      return Math.max(1, special.strength.value - 5);
    },
    suffix: "%",
  },
  skillRate: {
    title: "Skill Rate",
    description: "How many skill points are gained per level.",
    calculateValue: (special: UnitCharacteristics["SPECIAL"]) => {
      return special.intelligence.value * 2 + 5;
    },
    suffix: "",
  },
};
