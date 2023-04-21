import React, { Dispatch } from "react";
import { UIReducerAction } from "../reducers/ui/_reducers";

const initialValue: UIReducerAction = {
  type: "scrollMapOnScreenEdges",
  deltaTime: 0,
};

const initialDispatchFunc: Dispatch<UIReducerAction> = () => initialValue;

export const GameUiDispatchContext = React.createContext(initialDispatchFunc);
