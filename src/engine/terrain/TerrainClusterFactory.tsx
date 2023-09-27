import { GameTerrain } from "@src/context/GameTerrainContext";
import { constants } from "@src/engine/constants";
import { GameMap } from "@src/engine/gameMap";
import { getVisibleIsometricGridCells, gridToScreenSpace, randomUUID } from "@src/engine/helpers";

export interface TerrainClusterProps {
  canvas: OffscreenCanvas;
  ctx: OffscreenCanvasRenderingContext2D;
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
  private canvas: OffscreenCanvas;
  private ctx: OffscreenCanvasRenderingContext2D;

  constructor(props: TerrainClusterProps) {
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

    this.canvas = props.canvas;
    this.ctx = props.ctx;
  }

  public getBg() {
    return this.bg;
  }

  public async render(terrainState: GameTerrain, gameState: GameMap): Promise<string> {
    const tileWidth = constants.tileSize.width;
    const tileHeight = constants.tileSize.height;

    const terrainTiles = Object.values(
      getVisibleIsometricGridCells(
        {
          x: this.position.screen.x,
          y: this.position.screen.y,
          width: constants.TERRAIN_CLUSTER_SIZE.screen.width,
          height: constants.TERRAIN_CLUSTER_SIZE.screen.height,
        },
        gameState.mapSize,
        1,
      ).visibleCells,
    ).map((coordinates) => terrainState.getTerrainTileByCoordinates(coordinates));

    this.ctx.clearRect(0, 0, constants.TERRAIN_CLUSTER_SIZE.screen.width, constants.TERRAIN_CLUSTER_SIZE.screen.height);

    for (const terrainTile of terrainTiles) {
      if (!terrainTile) continue;

      const image = gameState.getAssetImage(terrainTile.type)?.source;

      if (image) {
        const shift = {
          x: this.position.grid.x * tileWidth,
          y: this.position.grid.y * tileHeight,
        };

        this.ctx.drawImage(
          image,
          tileWidth * (terrainTile.backgroundPosition.x || 0) + (terrainTile.backgroundPosition.x || 0) * 3 + 1,
          tileHeight * (terrainTile.backgroundPosition.y || 0) + (terrainTile.backgroundPosition.y || 0) * 3 + 1,
          terrainTile.size.screen.width,
          terrainTile.size.screen.height,
          terrainTile.screenPosition.screen.x - shift.x,
          terrainTile.screenPosition.screen.y - shift.y,
          terrainTile.size.screen.width,
          terrainTile.size.screen.height,
        );

        if (terrainTile.isMapExit) {
          const position = {
            x: terrainTile.position.x,
            y: terrainTile.position.y,
          };

          const tl = gridToScreenSpace(position, gameState.mapSize);
          const tr = gridToScreenSpace({ x: position.x + 1, y: position.y }, gameState.mapSize);
          const br = gridToScreenSpace({ x: position.x + 1, y: position.y + 1 }, gameState.mapSize);
          const bl = gridToScreenSpace({ x: position.x, y: position.y + 1 }, gameState.mapSize);

          this.ctx.fillStyle = "rgba(0,255,0, .2)";
          this.ctx.beginPath();
          this.ctx.moveTo(tl.x + tileWidth / 2 - shift.x, tl.y - shift.y);
          this.ctx.lineTo(tr.x + tileWidth / 2 - shift.x, tr.y - shift.y);
          this.ctx.lineTo(br.x + tileWidth / 2 - shift.x, br.y - shift.y);
          this.ctx.lineTo(bl.x + tileWidth / 2 - shift.x, bl.y - shift.y);
          this.ctx.closePath();

          this.ctx.fill();
        }
      }
    }

    return new Promise((resolve) => {
      this.canvas.convertToBlob().then((blob) => {
        this.bg = window.URL.createObjectURL(blob);

        resolve(this.bg);
      });
    });
  }

  public clear() {
    this.bg = "";
  }
}
