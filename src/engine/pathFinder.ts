import pathfinding from "pathfinding";
import { GameMap } from "./GameMap";

export function pathFinder(matrix: GameMap["matrix"], fromPos: GridCoordinates, toPos: GridCoordinates) {
  const grid = new pathfinding.Grid([...matrix]);
  const finder = new pathfinding.BestFirstFinder({
    diagonalMovement: pathfinding.DiagonalMovement.Never,
    heuristic: pathfinding.Heuristic.euclidean,
    weight: 1,
  });

  return finder.findPath(Math.floor(fromPos.x), Math.floor(fromPos.y), Math.floor(toPos.x), Math.floor(toPos.y), grid);
}
