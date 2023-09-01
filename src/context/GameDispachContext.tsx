import { StaticMap } from "@src/context/GameStateContext";
import { GameReducerAction } from "@src/reducers/_reducers";
import React, { Dispatch } from "react";

const initialValue: GameReducerAction = {
  type: "switchMap",
  map: {} as StaticMap,
  mediaFiles: {} as MediaAssets,
};

const initialDispatchFunc: Dispatch<GameReducerAction> = () => initialValue;

export const GameDispatchContext = React.createContext(initialDispatchFunc);
