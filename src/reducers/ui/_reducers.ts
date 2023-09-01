import { GameUI } from "@src/context/GameUIContext";
import { centerMapOnHero, CenterMapOnHeroUIReducerAction } from "@src/reducers/ui/centerMapOnHero";
import { detectKeyPress, DetectKeyPressUIReducerAction } from "@src/reducers/ui/detectKeyPress";
import { processKeyPress, ProcessKeyPressUIReducerAction } from "@src/reducers/ui/processKeyPress";
import { resetMousePosition, ResetMousePositionUIReducerAction } from "@src/reducers/ui/resetMousePosition";
import { scrollMap, ScrollMapUIReducerAction } from "@src/reducers/ui/scrollMap";
import { scrollMapOnScreenEdges, ScrollMapOnScreenEdgesUIReducerAction } from "@src/reducers/ui/scrollMapOnScreenEdges";
import { setEditorMode, SetEditorModeUIReducerAction } from "@src/reducers/ui/setEditorMode";
import {
  setIntroSceneElapsedTime,
  SetIntroSceneElapsedTimeUIReducerAction,
} from "@src/reducers/ui/setIntroSceneElapsedTime";
import { setMapRect, SetMapRectUIReducerAction } from "@src/reducers/ui/setMapRect";
import { setMousePosition, SetMousePositionUIReducerAction } from "@src/reducers/ui/setMousePosition";
import { setScene, SetSceneUIReducerAction } from "@src/reducers/ui/setScene";
import { setViewport, SetViewportUIReducerAction } from "@src/reducers/ui/setViewport";

export type UIReducerAction =
  | SetIntroSceneElapsedTimeUIReducerAction
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
    case "setIntroSceneElapsedTime":
      return setIntroSceneElapsedTime(state, action as SetIntroSceneElapsedTimeUIReducerAction);

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
