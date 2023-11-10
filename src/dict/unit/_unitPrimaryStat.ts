import { UnitCharacteristicDictEntity } from "@src/dict/unit/_unit";

export type UnitPrimaryStatName =
  | "strength"
  | "perception"
  | "endurance"
  | "charisma"
  | "intelligence"
  | "agility"
  | "luck";

export const unitPrimaryStats: { [p in UnitPrimaryStatName]: UnitCharacteristicDictEntity } = {
  strength: { title: "Strength", description: "Raw physical strength." },
  perception: { title: "Perception", description: "The ability to see, hear and taste and notice unusual things." },
  endurance: { title: "Endurance", description: "The ability to withstand punishment and physical exertion." },
  charisma: { title: "Charisma", description: "A combination of looks, charm and leadership skills." },
  intelligence: { title: "Intelligence", description: "Mental strength and abilities." },
  agility: { title: "Agility", description: "Speed, dexterity and the ability to manipulate small objects." },
  luck: {
    title: "Luck",
    description: "A combination of fate, Karma and, in general, how the universe views this character.",
  },
};
