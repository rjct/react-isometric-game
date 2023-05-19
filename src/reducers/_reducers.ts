import { moveUnit, MoveUnitReducerAction } from "./moveUnit";
import { animateUnitMove, AnimateUnitMoveReducerAction } from "./animateUnitMove";
import { highlightUnitPath, HighlightUnitPathReducerAction } from "./highlightUnitPath";
import { switchMap, SwitchMapReducerAction } from "./switchMap";
import { animateFiredAmmo, AnimateFiredAmmoAction } from "./animateFiredAmmo";
import { cleanupFiredAmmo, CleanupFiredAmmoAction } from "./cleanupFiredAmmo";
import { setCurrentUnitAction, SetCurrentUnitActionReducerAction } from "./setCurrentUnitAction";
import {
  highlightTargetWireframeCell,
  HighlightTargetWireframeCellReducerAction,
} from "./highlightTargetWireframeCell";
import { detectFiredAmmoHitsTarget, DetectFiredAmmoHitsTargetAction } from "./detectFiredAmmoHitsTarget";
import { detectHeroOnExitPoints, DetectHeroOnExitPointsAction } from "./detectHeroOnExitPoints";
import { toggleDebug, ToggleDebugReducerAction } from "./toggleDebug";
import { transferItem, TransferItemReducerAction } from "./transferItem";
import { GameMap } from "../engine/GameMap";
import { setSelectedBuilding, SetSelectedBuildingReducerAction } from "./editor/building/setSelectedBuilding";
import { clearSelectedBuilding, ClearSelectedBuildingReducerAction } from "./editor/building/clearSelectedBuilding";
import { setBuildingDirection, SetBuildingDirectionReducerAction } from "./editor/building/setBuildingDirection";
import { setBuildingVariant, SetBuildingVariantReducerAction } from "./editor/building/setBuildingVariant";
import { deleteSelectedBuilding, DeleteSelectedBuildingReducerAction } from "./editor/building/deleteSelectedBuilding";
import { addBuilding, AddBuildingReducerAction } from "./editor/building/addBuilding";
import { setSelectedTerrainArea, SetSelectedTerrainAreaReducerAction } from "./editor/terrain/setSelectedTerrainArea";
import {
  clearSelectedTerrainArea,
  ClearSelectedTerrainAreaReducerAction,
} from "./editor/terrain/clearSelectedTerrainArea";
import { setTerrainAreaType, SetTerrainAreaTypeReducerAction } from "./editor/terrain/setTerrainAreaType";
import { setTerrainAreaPosition, SetTerrainAreaPositionReducerAction } from "./editor/terrain/SetTerrainAreaPosition";
import { setTerrainAreaSize, SetTerrainAreaSizeReducerAction } from "./editor/terrain/SetTerrainAreaSize";
import {
  setTerrainAreaSourcePosition,
  SetTerrainAreaSourcePositionReducerAction,
} from "./editor/terrain/setTerrainAreaSourcePosition";
import {
  deleteSelectedTerrainArea,
  DeleteSelectedTerrainAreaReducerAction,
} from "./editor/terrain/deleteSelectedTerrainArea";
import { setTerrainAreaExitUrl, SetTerrainAreaExitUrlReducerAction } from "./editor/terrain/setTerrainAreaExitUrl";
import { addTerrainArea, AddTerrainAreaReducerAction } from "./editor/terrain/addTerrainArea";

export type GameReducerAction =
  | ToggleDebugReducerAction
  | SwitchMapReducerAction
  | MoveUnitReducerAction
  | AnimateUnitMoveReducerAction
  | AnimateFiredAmmoAction
  | CleanupFiredAmmoAction
  | HighlightUnitPathReducerAction
  | HighlightTargetWireframeCellReducerAction
  | SetCurrentUnitActionReducerAction
  | DetectFiredAmmoHitsTargetAction
  | DetectHeroOnExitPointsAction
  | TransferItemReducerAction
  //
  | AddBuildingReducerAction
  | SetSelectedBuildingReducerAction
  | ClearSelectedBuildingReducerAction
  | SetBuildingDirectionReducerAction
  | DeleteSelectedBuildingReducerAction
  | SetBuildingVariantReducerAction
  //
  | AddTerrainAreaReducerAction
  | SetSelectedTerrainAreaReducerAction
  | ClearSelectedTerrainAreaReducerAction
  | SetTerrainAreaTypeReducerAction
  | SetTerrainAreaPositionReducerAction
  | SetTerrainAreaSizeReducerAction
  | SetTerrainAreaSourcePositionReducerAction
  | SetTerrainAreaExitUrlReducerAction
  | DeleteSelectedTerrainAreaReducerAction;

export function reducer(state: GameMap, action: GameReducerAction): GameMap {
  switch (action.type) {
    case "toggleDebug":
      return toggleDebug(state, action as ToggleDebugReducerAction);

    case "switchMap":
      return switchMap(state, action as SwitchMapReducerAction);

    case "moveUnit":
      return moveUnit(state, action as MoveUnitReducerAction);

    case "animateUnitMove":
      return animateUnitMove(state, action as AnimateUnitMoveReducerAction);

    case "highlightUnitPath":
      return highlightUnitPath(state, action as HighlightUnitPathReducerAction);

    case "animateFiredAmmo":
      return animateFiredAmmo(state, action as AnimateFiredAmmoAction);

    case "cleanupFiredAmmo":
      return cleanupFiredAmmo(state, action as CleanupFiredAmmoAction);

    case "setCurrentUnitAction":
      return setCurrentUnitAction(state, action as SetCurrentUnitActionReducerAction);

    case "highlightTargetWireframeCell":
      return highlightTargetWireframeCell(state, action as HighlightTargetWireframeCellReducerAction);

    case "detectFiredAmmoHitsTarget":
      return detectFiredAmmoHitsTarget(state, action as DetectFiredAmmoHitsTargetAction);

    case "detectHeroOnExitPoints":
      return detectHeroOnExitPoints(state, action as DetectHeroOnExitPointsAction);

    case "transferItem":
      return transferItem(state, action as TransferItemReducerAction);

    // EDITOR: BUILDING
    case "addBuilding":
      return addBuilding(state, action as AddBuildingReducerAction);

    case "setSelectedBuilding":
      return setSelectedBuilding(state, action as SetSelectedBuildingReducerAction);

    case "clearSelectedBuilding":
      return clearSelectedBuilding(state, action as ClearSelectedBuildingReducerAction);

    case "setBuildingDirection":
      return setBuildingDirection(state, action as SetBuildingDirectionReducerAction);

    case "deleteSelectedBuilding":
      return deleteSelectedBuilding(state, action as DeleteSelectedBuildingReducerAction);

    case "setBuildingVariant":
      return setBuildingVariant(state, action as SetBuildingVariantReducerAction);

    // EDITOR: TERRAIN
    case "addTerrainArea":
      return addTerrainArea(state, action as AddTerrainAreaReducerAction);

    case "setSelectedTerrainArea":
      return setSelectedTerrainArea(state, action as SetSelectedTerrainAreaReducerAction);

    case "clearSelectedTerrainArea":
      return clearSelectedTerrainArea(state, action as ClearSelectedTerrainAreaReducerAction);

    case "setTerrainAreaType":
      return setTerrainAreaType(state, action as SetTerrainAreaTypeReducerAction);

    case "setTerrainAreaPosition":
      return setTerrainAreaPosition(state, action as SetTerrainAreaPositionReducerAction);

    case "setTerrainAreaSize":
      return setTerrainAreaSize(state, action as SetTerrainAreaSizeReducerAction);

    case "setTerrainAreaSourcePosition":
      return setTerrainAreaSourcePosition(state, action as SetTerrainAreaSourcePositionReducerAction);

    case "setTerrainAreaExitUrl":
      return setTerrainAreaExitUrl(state, action as SetTerrainAreaExitUrlReducerAction);

    case "deleteSelectedTerrainArea":
      return deleteSelectedTerrainArea(state, action as DeleteSelectedTerrainAreaReducerAction);

    default:
      throw new Error();
  }
}
