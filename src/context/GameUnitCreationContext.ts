import { UnitDerivedStatName } from "@src/dict/unit/_unitDerivedStat";
import { UnitPrimaryStatName } from "@src/dict/unit/_unitPrimaryStat";
import { UnitSkillName } from "@src/dict/unit/_unitSkills";
import React from "react";

export const GameUnitCreationContext = React.createContext<{
  selectedStat: UnitSkillName | UnitPrimaryStatName | UnitDerivedStatName | null;
  setSelectedStat: (stat: UnitSkillName | UnitPrimaryStatName | UnitDerivedStatName | null) => void;
}>({
  selectedStat: null,
  setSelectedStat: () => {
    //
  },
});
