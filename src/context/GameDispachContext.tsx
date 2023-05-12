import React, { Dispatch } from "react";
import { GameReducerAction } from "../reducers/_reducers";
import { StaticMap } from "./GameStateContext";

const initialValue: GameReducerAction = {
  type: "switchMap",
  map: {} as StaticMap,
  mediaFiles: {} as MediaFiles,
};

const initialDispatchFunc: Dispatch<GameReducerAction> = () => initialValue;

export const GameDispatchContext = React.createContext(initialDispatchFunc);
