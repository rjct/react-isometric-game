import { GameUI } from "../../context/GameUIContext";
import { scrollMap, ScrollMapUIReducerAction } from "./scrollMap";
import { setMapRect, SetMapRectUIReducerAction } from "./setMapRect";
import { setViewport, SetViewportUIReducerAction } from "./setViewport";
import { setMousePosition, SetMousePositionUIReducerAction } from "./setMousePosition";
import { scrollMapOnScreenEdges, ScrollMapOnScreenEdgesUIReducerAction } from "./scrollMapOnScreenEdges";
import { resetMousePosition, ResetMousePositionUIReducerAction } from "./resetMousePosition";
import { toggleInventory, ToggleInventoryUIReducerAction } from "./toggleInventory";
import { detectKeyPress, DetectKeyPressUIReducerAction } from "./detectKeyPress";
import { processKeyPress, ProcessKeyPressUIReducerAction } from "./processKeyPress";
import { setScene, SetSceneUIReducerAction } from "./setScene";

export type UIReducerAction =
  | ScrollMapUIReducerAction
  | ScrollMapOnScreenEdgesUIReducerAction
  | DetectKeyPressUIReducerAction
  | ProcessKeyPressUIReducerAction
  | SetMapRectUIReducerAction
  | SetViewportUIReducerAction
  | SetMousePositionUIReducerAction
  | ResetMousePositionUIReducerAction
  | ToggleInventoryUIReducerAction
  | SetSceneUIReducerAction;

export function UIReducer(state: GameUI, action: UIReducerAction): GameUI {
  switch (action.type) {
    case "scrollMap":
      return scrollMap(state, action as ScrollMapUIReducerAction);

    case "scrollMapOnScreenEdges":
      return scrollMapOnScreenEdges(state, action as ScrollMapOnScreenEdgesUIReducerAction);

    case "detectKeyPress":
      return detectKeyPress(state, action as DetectKeyPressUIReducerAction);

    case "processKeyPress":
      return processKeyPress(state, action as ProcessKeyPressUIReducerAction);

    case "setMapRect":
      return setMapRect(state, action as SetMapRectUIReducerAction);

    case "setViewport":
      return setViewport(state, action as SetViewportUIReducerAction);

    case "setMousePosition":
      return setMousePosition(state, action as SetMousePositionUIReducerAction);

    case "resetMousePosition":
      return resetMousePosition(state, action as ResetMousePositionUIReducerAction);

    case "toggleInventory":
      return toggleInventory(state, action as ToggleInventoryUIReducerAction);

    case "setScene":
      return setScene(state, action as SetSceneUIReducerAction);
  }
}
