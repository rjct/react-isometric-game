import { UnitSkillName } from "@src/dict/unit/_unitSkills";
import { GameMap } from "@src/engine/gameMap";

export type SetSkillPointsReducerAction = {
  type: "setSkillPoints";
  name: UnitSkillName;
  value: number;
};

export function setSkillPoints(state: GameMap, action: SetSkillPointsReducerAction): GameMap {
  const hero = state.getHero();

  hero.characteristics.availableSkillPoints -= action.value;
  hero.characteristics.skills[action.name].value += action.value;

  return { ...state };
}
