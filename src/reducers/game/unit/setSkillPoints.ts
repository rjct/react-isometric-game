import { UnitSkillName } from "@src/dict/unit/_unitSkills";
import { GameMap } from "@src/engine/gameMap";
import { Unit } from "@src/engine/unit/UnitFactory";

export type SetSkillPointsReducerAction = {
  type: "setSkillPoints";
  unit: Unit;
  skillName: UnitSkillName;
  skillValue: number;
};

export function setSkillPoints(state: GameMap, action: SetSkillPointsReducerAction): GameMap {
  const { unit, skillName, skillValue } = action;

  unit.characteristics.availableSkillPoints -= skillValue;
  unit.characteristics.skills[skillName].value += skillValue;

  return { ...state };
}
