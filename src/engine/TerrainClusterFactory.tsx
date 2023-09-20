import { constants } from "@src/constants";
import { GameMap } from "@src/engine/GameMap";
import { getVisibleIsometricGridCells, randomUUID } from "@src/engine/helpers";

export interface TerrainClusterProps {
  canvas: OffscreenCanvas;
  ctx: OffscreenCanvasRenderingContext2D;
  gameState: GameMap;
  position: {
    grid: GridCoordinates;
  };
}

export class TerrainCluster {
  public readonly id: string;

  public readonly position: {
    grid: GridCoordinates;
    screen: ScreenCoordinates;
  };

  public bg = "";

  constructor(props: TerrainClusterProps) {
    const tileWidth = constants.tileSize.width;
    const tileHeight = constants.tileSize.height;

    //
    this.id = randomUUID();

    this.position = {
      grid: {
        x: props.position.grid.x * constants.TERRAIN_CLUSTER_SIZE.grid.width,
        y: props.position.grid.y * constants.TERRAIN_CLUSTER_SIZE.grid.height,
      },
      screen: {
        x: props.position.grid.x * constants.TERRAIN_CLUSTER_SIZE.screen.width,
        y: props.position.grid.y * constants.TERRAIN_CLUSTER_SIZE.screen.height,
      },
    };

    const terrainTiles = Object.values(
      getVisibleIsometricGridCells(
        {
          x: this.position.screen.x,
          y: this.position.screen.y,
          width: constants.TERRAIN_CLUSTER_SIZE.screen.width,
          height: constants.TERRAIN_CLUSTER_SIZE.screen.height,
        },
        props.gameState.mapSize,
        1,
      ).visibleCells,
    ).map((coordinates) => props.gameState.getTerrainTileByCoordinates(coordinates));

    props.ctx.clearRect(
      0,
      0,
      constants.TERRAIN_CLUSTER_SIZE.screen.width,
      constants.TERRAIN_CLUSTER_SIZE.screen.height,
    );

    for (const terrainTile of terrainTiles) {
      if (!terrainTile) continue;

      const image = props.gameState.getAssetImage(terrainTile.type)?.source;

      if (image) {
        props.ctx.drawImage(
          image,
          tileWidth * (terrainTile.backgroundPosition.x || 0) + (terrainTile.backgroundPosition.x || 0) * 3 + 1,
          tileHeight * (terrainTile.backgroundPosition.y || 0) + (terrainTile.backgroundPosition.y || 0) * 3 + 1,
          terrainTile.size.screen.width,
          terrainTile.size.screen.height,
          terrainTile.screenPosition.screen.x - this.position.grid.x * tileWidth,
          terrainTile.screenPosition.screen.y - this.position.grid.y * tileHeight,
          terrainTile.size.screen.width,
          terrainTile.size.screen.height,
        );
      }
    }

    props.canvas.convertToBlob().then((blob) => {
      this.bg = window.URL.createObjectURL(blob);
    });
  }
}
