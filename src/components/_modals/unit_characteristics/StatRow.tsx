import { GameUnitCreationContext } from "@src/context/GameUnitCreationContext";
import { UnitDerivedStatName } from "@src/dict/unit/_unitDerivedStat";
import { UnitPrimaryStatName } from "@src/dict/unit/_unitPrimaryStat";
import { UnitSkillName } from "@src/dict/unit/_unitSkills";
import { UnitDerivedStat } from "@src/engine/unit/UnitDerivedStatFactory";
import { UnitPrimaryStat } from "@src/engine/unit/UnitPrimaryStatFactory";
import { UnitSkill } from "@src/engine/unit/UnitSkillFactory";
import React from "react";

function Value(props: { value: string | number }) {
  return (
    <span className={"stat-value blink-white"} key={props.value}>
      {props.value}
    </span>
  );
}

export const StatRow = (props: {
  stat: UnitPrimaryStat | UnitSkill | UnitDerivedStat;
  children?: React.ReactElement;
}) => {
  const { selectedStat, setSelectedStat } = React.useContext(GameUnitCreationContext);

  const { value, dictEntity } = props.stat;

  const suffix = dictEntity.suffix;
  const handleItemClick = (e: React.MouseEvent, key: UnitSkillName | UnitPrimaryStatName | UnitDerivedStatName) => {
    e.stopPropagation();

    setSelectedStat(key);
  };

  return (
    <div
      className={"list-row"}
      data-selected={selectedStat === props.stat.name || undefined}
      onClick={(e) => handleItemClick(e, props.stat.name)}
    >
      <div className={"list-row-body"}>
        <div className={"stat-title"}>{dictEntity.title}</div>
        <div className={"stat-value-wrapper"}>
          <Value value={value} />

          <span className={"stat-value-suffix"}>{suffix}</span>
        </div>
      </div>

      {props.children ? <div className={"list-row-controls"}>{props.children}</div> : null}
    </div>
  );
};
