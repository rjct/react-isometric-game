import { NothingSelectedText } from "@src/components/editor/_shared/NothingSelectedText";
import { GameUnitCreationContext } from "@src/context/GameUnitCreationContext";
import { UnitCharacteristicDictEntity } from "@src/dict/unit/_unit";
import { UnitDerivedStatName, unitDerivedStats } from "@src/dict/unit/_unitDerivedStat";
import { UnitPrimaryStatName, unitPrimaryStats } from "@src/dict/unit/_unitPrimaryStat";
import { UnitSkillName, unitSkills } from "@src/dict/unit/_unitSkills";
import React from "react";

function _getInfoComponent(stat: UnitPrimaryStatName | UnitSkillName | UnitDerivedStatName | null) {
  switch (true) {
    case !!unitSkills[stat as UnitSkillName]:
      return <_InfoComponent dictEntity={unitSkills[stat as UnitSkillName]} />;

    case !!unitPrimaryStats[stat as UnitPrimaryStatName]:
      return <_InfoComponent dictEntity={unitPrimaryStats[stat as UnitPrimaryStatName]} />;

    case !!unitDerivedStats[stat as UnitDerivedStatName]:
      return <_InfoComponent dictEntity={unitDerivedStats[stat as UnitDerivedStatName]} />;

    default:
      return <NothingSelectedText />;
  }
}

function _InfoComponent(props: { dictEntity: UnitCharacteristicDictEntity }) {
  return (
    <>
      <div className={"header"}>{props.dictEntity.title}</div>
      <div className={"stat-info-body"}>{props.dictEntity.description}</div>
    </>
  );
}

export function SkillOverview() {
  const { selectedStat } = React.useContext(GameUnitCreationContext);

  return (
    <fieldset className={"stat-info-wrapper"}>
      <legend className={"outlined"}>Info</legend>
      {_getInfoComponent(selectedStat)}
    </fieldset>
  );
}
