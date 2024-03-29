import { GameTerrain } from "@src/context/GameTerrainContext";
import { addTerrainArea, AddTerrainAreaReducerAction } from "@src/reducers/terrain/addTerrainArea";
import {
  clearSelectedTerrainArea,
  ClearSelectedTerrainAreaReducerAction,
} from "@src/reducers/terrain/clearSelectedTerrainArea";
import { clearTerrainClusters, ClearTerrainClustersReducerAction } from "@src/reducers/terrain/clearTerrainClusters";
import {
  cloneSelectedTerrainArea,
  CloneSelectedTerrainAreaReducerAction,
} from "@src/reducers/terrain/cloneSelectedTerrainArea";
import {
  deleteSelectedTerrainArea,
  DeleteSelectedTerrainAreaReducerAction,
} from "@src/reducers/terrain/deleteSelectedTerrainArea";
import {
  setSelectedTerrainArea,
  SetSelectedTerrainAreaReducerAction,
} from "@src/reducers/terrain/setSelectedTerrainArea";
import { setTerrainAreaExitUrl, SetTerrainAreaExitUrlReducerAction } from "@src/reducers/terrain/setTerrainAreaExitUrl";
import {
  setTerrainAreaPosition,
  SetTerrainAreaPositionReducerAction,
} from "@src/reducers/terrain/SetTerrainAreaPosition";
import { setTerrainAreaSize, SetTerrainAreaSizeReducerAction } from "@src/reducers/terrain/SetTerrainAreaSize";
import {
  setTerrainAreaSourcePosition,
  SetTerrainAreaSourcePositionReducerAction,
} from "@src/reducers/terrain/setTerrainAreaSourcePosition";
import { setTerrainAreaType, SetTerrainAreaTypeReducerAction } from "@src/reducers/terrain/setTerrainAreaType";
import {
  setTerrainAreaVisibility,
  SetTerrainAreaVisibilityReducerAction,
} from "@src/reducers/terrain/setTerrainAreaVisibility";
import {
  setTerrainClustersInView,
  SetTerrainClustersInViewReducerAction,
} from "@src/reducers/terrain/setTerrainClustersInView";
import { switchMap, SwitchTerrainMapReducerAction } from "@src/reducers/terrain/switchMap";

export type TerrainReducerAction =
  | SwitchTerrainMapReducerAction
  | AddTerrainAreaReducerAction
  | CloneSelectedTerrainAreaReducerAction
  | ClearSelectedTerrainAreaReducerAction
  | DeleteSelectedTerrainAreaReducerAction
  | SetSelectedTerrainAreaReducerAction
  | SetTerrainAreaExitUrlReducerAction
  | SetTerrainAreaPositionReducerAction
  | SetTerrainAreaSizeReducerAction
  | SetTerrainAreaSourcePositionReducerAction
  | SetTerrainAreaTypeReducerAction
  | SetTerrainClustersInViewReducerAction
  | ClearTerrainClustersReducerAction
  | SetTerrainAreaVisibilityReducerAction;

export function TerrainReducer(state: GameTerrain, action: TerrainReducerAction): GameTerrain {
  switch (action.type) {
    case "switchMap":
      return switchMap(state, action as SwitchTerrainMapReducerAction);

    case "addTerrainArea":
      return addTerrainArea(state, action as AddTerrainAreaReducerAction);

    case "cloneSelectedTerrainArea":
      return cloneSelectedTerrainArea(state, action as CloneSelectedTerrainAreaReducerAction);

    case "clearSelectedTerrainArea":
      return clearSelectedTerrainArea(state, action as ClearSelectedTerrainAreaReducerAction);

    case "deleteSelectedTerrainArea":
      return deleteSelectedTerrainArea(state, action as DeleteSelectedTerrainAreaReducerAction);

    case "setSelectedTerrainArea":
      return setSelectedTerrainArea(state, action as SetSelectedTerrainAreaReducerAction);

    case "setTerrainAreaExitUrl":
      return setTerrainAreaExitUrl(state, action as SetTerrainAreaExitUrlReducerAction);

    case "setTerrainAreaPosition":
      return setTerrainAreaPosition(state, action as SetTerrainAreaPositionReducerAction);

    case "setTerrainAreaSize":
      return setTerrainAreaSize(state, action as SetTerrainAreaSizeReducerAction);

    case "setTerrainAreaSourcePosition":
      return setTerrainAreaSourcePosition(state, action as SetTerrainAreaSourcePositionReducerAction);

    case "setTerrainAreaType":
      return setTerrainAreaType(state, action as SetTerrainAreaTypeReducerAction);

    case "setTerrainClustersInView":
      return setTerrainClustersInView(state, action as SetTerrainClustersInViewReducerAction);

    case "clearTerrainClusters":
      return clearTerrainClusters(state, action as ClearTerrainClustersReducerAction);

    case "setTerrainAreaVisibility":
      return setTerrainAreaVisibility(state, action as SetTerrainAreaVisibilityReducerAction);
  }
}
