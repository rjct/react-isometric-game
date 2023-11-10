import { UnitCharacteristicDictEntity } from "@src/dict/unit/_unit";
import { UnitCharacteristics } from "@src/engine/unit/UnitCharacteristicsFactory";

export type UnitCombatSkillName = "smallGuns" | "bigGuns" | "energyWeapons" | "unarmed" | "meleeWeapons" | "throwing";
export type UnitActiveSkillName =
  | "firstAid"
  | "doctor"
  | "sneak"
  | "lockpick"
  | "steal"
  | "traps"
  | "science"
  | "repair";

export type UnitPassiveSkillName = "pilot" | "barter" | "gambling" | "outdoorsman";

export const unitCombatSkills: { [p in UnitCombatSkillName]: UnitCharacteristicDictEntity } = {
  smallGuns: {
    title: "Small guns",
    description: "The use, care and general knowledge of small firearms - pistols, SMGs and rifles.",
    calculateValue: (special: UnitCharacteristics["SPECIAL"]) => {
      return 5 + 4 * special.agility.value;
    },
    suffix: "%",
  },
  bigGuns: {
    title: "Big guns",
    description:
      "The operation and maintenance of really big guns - miniguns, rocket launchers, flamethrowers and such.",
    calculateValue: (special: UnitCharacteristics["SPECIAL"]) => {
      return 2 * special.agility.value;
    },
    suffix: "%",
  },
  energyWeapons: {
    title: "Energy Weapons",
    description:
      "The care and feeding of energy-based weapons. How to arm and operate weapons that use laser or plasma technology.",
    calculateValue: (special: UnitCharacteristics["SPECIAL"]) => {
      return 2 * special.agility.value;
    },
    suffix: "%",
  },
  unarmed: {
    title: "Unarmed",
    description:
      "A combination of martial arts, boxing and other hand-to-hand martial arts. Combat with your hands and feet.",
    calculateValue: (special: UnitCharacteristics["SPECIAL"]) => {
      return 30 + 2 * (special.strength.value + special.agility.value);
    },
    suffix: "%",
  },
  meleeWeapons: {
    title: "Melee Weapons",
    description:
      "Using non-ranged weapons in hand-to-hand or melee combat - knives, sledgehammers, spears, clubs and so on.",
    calculateValue: (special: UnitCharacteristics["SPECIAL"]) => {
      return 20 + 2 * (special.strength.value + special.agility.value);
    },
    suffix: "%",
  },
  throwing: {
    title: "Throwing",
    description: "The skill of muscle-propelled ranged weapons, such as throwing knives, spears and grenades.",
    calculateValue: (special: UnitCharacteristics["SPECIAL"]) => {
      return 4 * special.agility.value;
    },
    suffix: "%",
  },
};

export const unitActiveSkills: { [p in UnitActiveSkillName]: UnitCharacteristicDictEntity } = {
  firstAid: {
    title: "First Aid",
    description:
      "General healing skill. Used to heal small cuts, abrasions and other minor ills. In game terms, the use of first aid can heal more hit points over time than just rest.",
    calculateValue: (special: UnitCharacteristics["SPECIAL"]) => {
      return 2 * (special.perception.value + special.intelligence.value);
    },
    suffix: "%",
  },
  doctor: {
    title: "Doctor",
    description:
      "The healing of major wounds and crippled limbs. Without this skill, it will take a much longer period of time to restore crippled limbs to use.",
    calculateValue: (special: UnitCharacteristics["SPECIAL"]) => {
      return 5 + special.perception.value + special.intelligence.value;
    },
    suffix: "%",
  },
  sneak: {
    title: "Sneak",
    description:
      "Quiet movement, and the ability to remain unnoticed. If successful, you will be much harder to locate. You cannot run and sneak at the same time.",
    calculateValue: (special: UnitCharacteristics["SPECIAL"]) => {
      return 5 + 3 * special.agility.value;
    },
    suffix: "%",
  },
  lockpick: {
    title: "Lockpick",
    description:
      "The skill of opening locks without the proper key. The use of lockpicks or electronic lockpicks will greatly enhance this skill.",
    calculateValue: (special: UnitCharacteristics["SPECIAL"]) => {
      return 10 + special.perception.value + special.agility.value;
    },
    suffix: "%",
  },
  steal: {
    title: "Steal",
    description: "The ability to make things of others your own. Can be used to steal from people or places.",
    calculateValue: (special: UnitCharacteristics["SPECIAL"]) => {
      return 3 * special.agility.value;
    },
    suffix: "%",
  },
  traps: {
    title: "Traps",
    description: "The finding and removal of traps. Also the setting of explosives for demolition purposes.",
    calculateValue: (special: UnitCharacteristics["SPECIAL"]) => {
      return 10 + special.perception.value + special.agility.value;
    },
    suffix: "%",
  },
  science: {
    title: "Science",
    description: "Covers a variety of high-technology skills, such as computers, biology, physics, and geology.",
    calculateValue: (special: UnitCharacteristics["SPECIAL"]) => {
      return 4 * special.intelligence.value;
    },
    suffix: "%",
  },
  repair: {
    title: "Repair",
    description:
      "The practical application of the Science skill, for fixing of broken equipment, machinery and electronics.",
    calculateValue: (special: UnitCharacteristics["SPECIAL"]) => {
      return 3 * special.intelligence.value;
    },
    suffix: "%",
  },
};

export const unitPassiveSkills: { [p in UnitPassiveSkillName]: UnitCharacteristicDictEntity } = {
  pilot: {
    title: "Pilot",
    description: "The ability to operate and maintain all vehicles effectively.",
    calculateValue: (special: UnitCharacteristics["SPECIAL"]) => {
      return 2 * (special.perception.value + special.agility.value);
    },
    suffix: "%",
  },
  barter: {
    title: "Barter",
    description:
      "Trading and trade-related tasks. The ability to get better prices for items you sell, and lower prices for items you buy.",
    calculateValue: (special: UnitCharacteristics["SPECIAL"]) => {
      return 4 * special.charisma.value;
    },
    suffix: "%",
  },
  gambling: {
    title: "Gambling",
    description: "The knowledge and practical skills related to wagering. The skill at cards, dice and other games.",
    calculateValue: (special: UnitCharacteristics["SPECIAL"]) => {
      return 5 * special.luck.value;
    },
    suffix: "%",
  },
  outdoorsman: {
    title: "Outdoorsman",
    description:
      "Practical knowledge of the outdoors, and the ability to live off the land. The knowledge of plants and animals.",
    calculateValue: (special: UnitCharacteristics["SPECIAL"]) => {
      return 2 * (special.endurance.value + special.intelligence.value);
    },
    suffix: "%",
  },
};

export const unitSkills = {
  ...unitCombatSkills,
  ...unitActiveSkills,
  ...unitPassiveSkills,
};

export type UnitSkillName = UnitCombatSkillName | UnitActiveSkillName | UnitPassiveSkillName;
