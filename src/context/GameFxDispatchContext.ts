import { FxReducerAction } from "@src/reducers/fx/_reducers";
import React, { Dispatch } from "react";

const initialValue: FxReducerAction = {
  type: "addFx",
  coordinates: { x: 0, y: 0 },
  effectType: "explosion",
};

const initialDispatchFunc: Dispatch<FxReducerAction> = () => initialValue;

export const GameFxDispatchContext = React.createContext(initialDispatchFunc);
