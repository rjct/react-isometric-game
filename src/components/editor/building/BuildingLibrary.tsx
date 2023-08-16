import buildingTypes from "../../../dict/buildings.json";
import { BuildingLibraryItem } from "./BuildingLibraryItem";
import { DictBuilding } from "../../../engine/BuildingFactory";
import { useGameState } from "../../../hooks/useGameState";
import React from "react";

export const BuildingLibrary = React.memo(() => {
  const { uiState } = useGameState();

  const groups = new Map();

  Object.values(buildingTypes).forEach((building) => {
    groups.has(building.class) ? groups.get(building.class).push(building) : groups.set(building.class, [building]);
  });

  const groupNames = Array.from(groups.keys());

  const [selectedGroup, setSelectedGroup] = React.useState(groupNames[0]);

  const handleTabChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedGroup(e.target.value);
  };

  return uiState.editorMode === "buildings" ? (
    <div className={"ui-tabs"} data-direction={"vertical"}>
      <div className={"ui-tabs-nav"}>
        {groupNames.map((groupName) => {
          const isActive = selectedGroup === groupName;
          const activeClass = isActive ? "active" : "";

          return (
            <div className={["ui-button", activeClass].join(" ")} key={groupName}>
              <label className="ui-radio" htmlFor={`editor-library-group-${groupName}`}>
                <input
                  type={"radio"}
                  name={"editor-library-group"}
                  id={`editor-library-group-${groupName}`}
                  value={groupName}
                  checked={isActive}
                  disabled={isActive}
                  onChange={handleTabChange}
                />
                <div className={"label"}>
                  <span>{groupName}</span>
                </div>
              </label>
            </div>
          );
        })}
      </div>

      {groupNames.map((groupName) => {
        return selectedGroup === groupName ? (
          <div className={"ui-tab-content"} data-group={groupName} key={groupName}>
            <div className={"editor-library-scroller"}>
              {groups.get(groupName).map((building: DictBuilding) => {
                return new Array(building.variants).fill(0).map((value, index) => {
                  return <BuildingLibraryItem key={`${building.type}-${index}`} item={building} variant={index} />;
                });
              })}
            </div>
          </div>
        ) : null;
      })}
    </div>
  ) : null;
});
