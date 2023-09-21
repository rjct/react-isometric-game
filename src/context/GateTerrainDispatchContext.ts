import { TerrainReducerAction } from "@src/reducers/terrain/_reducers";
import React, { Dispatch } from "react";

const initialValue: TerrainReducerAction = {
  type: "clearSelectedTerrainArea",
};

const initialDispatchFunc: Dispatch<TerrainReducerAction> = () => initialValue;

export const GameTerrainDispatchContext = React.createContext(initialDispatchFunc);
