import { UIReducerAction } from "@src/reducers/ui/_reducers";
import React, { Dispatch } from "react";

const initialValue: UIReducerAction = {
  type: "resetMousePosition",
};

const initialDispatchFunc: Dispatch<UIReducerAction> = () => initialValue;

export const GameUiDispatchContext = React.createContext(initialDispatchFunc);
