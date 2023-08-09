import { GameUI } from "../../context/GameUIContext";
import { scrollMap, ScrollMapUIReducerAction } from "./scrollMap";
import { setMapRect, SetMapRectUIReducerAction } from "./setMapRect";
import { setViewport, SetViewportUIReducerAction } from "./setViewport";
import { scrollMapOnScreenEdges, ScrollMapOnScreenEdgesUIReducerAction } from "./scrollMapOnScreenEdges";
import { detectKeyPress, DetectKeyPressUIReducerAction } from "./detectKeyPress";
import { processKeyPress, ProcessKeyPressUIReducerAction } from "./processKeyPress";
import { setScene, SetSceneUIReducerAction } from "./setScene";
import { centerMapOnHero, CenterMapOnHeroUIReducerAction } from "./centerMapOnHero";
import { setEditorMode, SetEditorModeUIReducerAction } from "./setEditorMode";
import { resetMousePosition, ResetMousePositionUIReducerAction } from "./resetMousePosition";
import { setMousePosition, SetMousePositionUIReducerAction } from "./setMousePosition";

export type UIReducerAction =
  | CenterMapOnHeroUIReducerAction
  | ScrollMapUIReducerAction
  | ScrollMapOnScreenEdgesUIReducerAction
  | DetectKeyPressUIReducerAction
  | ProcessKeyPressUIReducerAction
  | SetMapRectUIReducerAction
  | SetViewportUIReducerAction
  | SetMousePositionUIReducerAction
  | ResetMousePositionUIReducerAction
  | SetSceneUIReducerAction
  | SetEditorModeUIReducerAction;

export function UIReducer(state: GameUI, action: UIReducerAction): GameUI {
  switch (action.type) {
    case "centerMapOnHero":
      return centerMapOnHero(state, action as CenterMapOnHeroUIReducerAction);

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

    case "setScene":
      return setScene(state, action as SetSceneUIReducerAction);

    case "setEditorMode":
      return setEditorMode(state, action as SetEditorModeUIReducerAction);
  }
}
