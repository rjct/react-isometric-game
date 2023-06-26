import { moveUnit, MoveUnitReducerAction } from "./game/unit/moveUnit";
import { animateUnitMove, AnimateUnitMoveReducerAction } from "./game/unit/animateUnitMove";
import { switchMap, SwitchMapReducerAction } from "./switchMap";
import { animateFiredAmmo, AnimateFiredAmmoAction } from "./animateFiredAmmo";
import { cleanupFiredAmmo, CleanupFiredAmmoAction } from "./cleanupFiredAmmo";
import { setCurrentUnitAction, SetCurrentUnitActionReducerAction } from "./game/unit/setCurrentUnitAction";

import { detectFiredAmmoHitsTarget, DetectFiredAmmoHitsTargetAction } from "./detectFiredAmmoHitsTarget";
import { detectHeroOnExitPoints, DetectHeroOnExitPointsAction } from "./detectHeroOnExitPoints";
import { toggleDebug, ToggleDebugReducerAction } from "./game/debug/toggleDebug";
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
import { setBuildingPosition, SetBuildingPositionReducerAction } from "./editor/building/setBuildingPosition";
import { toggleDebugFeature, ToggleDebugFeatureReducerAction } from "./game/debug/toggleDebugFeature";
import { useEntityInUnitHand, UseEntityInUnitHandReducerAction } from "./game/unit/useEntityInUnitHand";
import { addLight, AddLightReducerAction } from "./editor/light/addLight";
import { setSelectedLight, SetSelectedLightReducerAction } from "./editor/light/setSelectedLight";
import { clearSelectedLight, ClearSelectedLightReducerAction } from "./editor/light/clearSelectedLight";
import { setLightPosition, SetLightPositionReducerAction } from "./editor/light/setLightPosition";
import { deleteSelectedLight, DeleteSelectedLightReducerAction } from "./editor/light/deleteSelectedLight";
import { setLightRadius, SetLightRadiusReducerAction } from "./editor/light/setLightRadius";
import { setLightColor, SetLightColorReducerAction } from "./editor/light/setLightColor";
import { setShadowsOpacity, SetShadowsOpacityReducerAction } from "./editor/light/setShadowsOpacity";
import { setShadowsColor, SetShadowsColorReducerAction } from "./editor/light/setShadowsColor";
import { loadMap, LoadMapReducerAction } from "./loadMap";
import { toggleFeature, ToggleFeatureReducerAction } from "./game/debug/toggleFeature";
import { addUnit, AddUnitReducerAction } from "./editor/unit/addUnit";
import { setSelectedUnit, SetSelectedUnitReducerAction } from "./editor/unit/setSelectedUnit";
import { clearSelectedUnit, ClearSelectedUnitReducerAction } from "./editor/unit/clearSelectedUnit";
import { deleteSelectedUnit, DeleteSelectedUnitReducerAction } from "./editor/unit/deleteSelectedUnit";
import { setUnitPosition, SetUnitPositionReducerAction } from "./editor/unit/setUnitPosition";
import { recalculateUnitFieldOfView, RecalculateUnitFieldOfViewReducerAction } from "./game/unit/recalcUnitFieldOfView";

export type GameReducerAction =
  | ToggleDebugReducerAction
  | ToggleFeatureReducerAction
  | ToggleDebugFeatureReducerAction
  //
  | LoadMapReducerAction
  | SwitchMapReducerAction
  | MoveUnitReducerAction
  | AnimateUnitMoveReducerAction
  | UseEntityInUnitHandReducerAction
  | RecalculateUnitFieldOfViewReducerAction
  //
  | AnimateFiredAmmoAction
  | CleanupFiredAmmoAction
  | SetCurrentUnitActionReducerAction
  | DetectHeroOnExitPointsAction
  | TransferItemReducerAction
  //
  | DetectFiredAmmoHitsTargetAction
  //
  | AddBuildingReducerAction
  | SetSelectedBuildingReducerAction
  | ClearSelectedBuildingReducerAction
  | SetBuildingDirectionReducerAction
  | DeleteSelectedBuildingReducerAction
  | SetBuildingVariantReducerAction
  | SetBuildingPositionReducerAction
  //
  | AddUnitReducerAction
  | SetSelectedUnitReducerAction
  | ClearSelectedUnitReducerAction
  | DeleteSelectedUnitReducerAction
  | SetUnitPositionReducerAction
  //
  | AddTerrainAreaReducerAction
  | SetSelectedTerrainAreaReducerAction
  | ClearSelectedTerrainAreaReducerAction
  | SetTerrainAreaTypeReducerAction
  | SetTerrainAreaPositionReducerAction
  | SetTerrainAreaSizeReducerAction
  | SetTerrainAreaSourcePositionReducerAction
  | SetTerrainAreaExitUrlReducerAction
  | DeleteSelectedTerrainAreaReducerAction
  //
  | SetShadowsOpacityReducerAction
  | SetShadowsColorReducerAction
  | AddLightReducerAction
  | SetSelectedLightReducerAction
  | ClearSelectedLightReducerAction
  | SetLightPositionReducerAction
  | SetLightRadiusReducerAction
  | SetLightColorReducerAction
  | DeleteSelectedLightReducerAction;

export function reducer(state: GameMap, action: GameReducerAction): GameMap {
  switch (action.type) {
    case "toggleDebug":
      return toggleDebug(state, action as ToggleDebugReducerAction);

    case "toggleDebugFeature":
      return toggleDebugFeature(state, action as ToggleDebugFeatureReducerAction);

    case "toggleFeature":
      return toggleFeature(state, action as ToggleFeatureReducerAction);

    //
    case "loadMap":
      return loadMap(state, action as LoadMapReducerAction);

    case "switchMap":
      return switchMap(state, action as SwitchMapReducerAction);

    //

    //
    case "moveUnit":
      return moveUnit(state, action as MoveUnitReducerAction);

    case "animateUnitMove":
      return animateUnitMove(state, action as AnimateUnitMoveReducerAction);

    case "useEntityInUnitHand":
      return useEntityInUnitHand(state, action as UseEntityInUnitHandReducerAction);

    case "recalculateUnitFieldOfView":
      return recalculateUnitFieldOfView(state, action as RecalculateUnitFieldOfViewReducerAction);

    //
    case "animateFiredAmmo":
      return animateFiredAmmo(state, action as AnimateFiredAmmoAction);

    case "cleanupFiredAmmo":
      return cleanupFiredAmmo(state, action as CleanupFiredAmmoAction);

    case "setCurrentUnitAction":
      return setCurrentUnitAction(state, action as SetCurrentUnitActionReducerAction);

    case "detectHeroOnExitPoints":
      return detectHeroOnExitPoints(state, action as DetectHeroOnExitPointsAction);

    case "transferItem":
      return transferItem(state, action as TransferItemReducerAction);

    // WEAPON
    case "detectFiredAmmoHitsTarget":
      return detectFiredAmmoHitsTarget(state, action as DetectFiredAmmoHitsTargetAction);

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

    case "setBuildingPosition":
      return setBuildingPosition(state, action as SetBuildingPositionReducerAction);

    // EDITOR: UNIT
    case "addUnit":
      return addUnit(state, action as AddUnitReducerAction);

    case "setSelectedUnit":
      return setSelectedUnit(state, action as SetSelectedUnitReducerAction);

    case "clearSelectedUnit":
      return clearSelectedUnit(state, action as ClearSelectedUnitReducerAction);

    case "deleteSelectedUnit":
      return deleteSelectedUnit(state, action as DeleteSelectedUnitReducerAction);

    case "setUnitPosition":
      return setUnitPosition(state, action as SetUnitPositionReducerAction);

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

    // EDITOR: LIGHT
    case "setShadowsOpacity":
      return setShadowsOpacity(state, action as SetShadowsOpacityReducerAction);

    case "setShadowsColor":
      return setShadowsColor(state, action as SetShadowsColorReducerAction);

    case "addLight":
      return addLight(state, action as AddLightReducerAction);

    case "setSelectedLight":
      return setSelectedLight(state, action as SetSelectedLightReducerAction);

    case "clearSelectedLight":
      return clearSelectedLight(state, action as ClearSelectedLightReducerAction);

    case "setLightPosition":
      return setLightPosition(state, action as SetLightPositionReducerAction);

    case "setLightRadius":
      return setLightRadius(state, action as SetLightRadiusReducerAction);

    case "setLightColor":
      return setLightColor(state, action as SetLightColorReducerAction);

    case "deleteSelectedLight":
      return deleteSelectedLight(state, action as DeleteSelectedLightReducerAction);
    default:
      throw new Error();
  }
}
