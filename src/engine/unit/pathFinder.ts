import { GameMap } from "@src/engine/gameMap";
import pathfinding from "pathfinding";

export function pathFinderAStar(
  matrix: GameMap["matrix"],
  fromPos: GridCoordinates,
  toPos: GridCoordinates,
  diagonalMovement: pathfinding.DiagonalMovement = pathfinding.DiagonalMovement.Never,
) {
  const grid = new pathfinding.Grid(matrix);
  const finder = new pathfinding.AStarFinder({
    diagonalMovement: diagonalMovement,
    heuristic: pathfinding.Heuristic.euclidean,
  });

  return finder.findPath(Math.round(fromPos.x), Math.round(fromPos.y), Math.round(toPos.x), Math.round(toPos.y), grid);
}

export function pathFinderBiAStar(matrix: GameMap["matrix"], fromPos: GridCoordinates, toPos: GridCoordinates) {
  const grid = new pathfinding.Grid(matrix);
  const finder = new pathfinding.BiAStarFinder({
    diagonalMovement: pathfinding.DiagonalMovement.Never,
    heuristic: pathfinding.Heuristic.euclidean,
  });

  return finder.findPath(Math.round(fromPos.x), Math.round(fromPos.y), Math.round(toPos.x), Math.round(toPos.y), grid);
}

export function convertPathToCoordinatesArray(path: number[][]): GridCoordinates[] {
  return path.map((iter) => {
    return { x: iter[0], y: iter[1] };
  });
}
