import { constants } from "@src/constants";
import { TerrainArea, TerrainTile } from "@src/engine/TerrainAreaFactory";
import { TerrainCluster } from "@src/engine/TerrainClusterFactory";
import { Unit } from "@src/engine/UnitFactory";
import React from "react";

const gameTerrainContext = {
  selectedTerrainArea: null as unknown as TerrainArea,
  areas: [] as TerrainArea[],
  clusters: [] as TerrainCluster[],
  clustersInView: [] as TerrainCluster[],

  isUnitIsInExitPoint(unit: Unit) {
    const { position } = unit;
    const terrainArea = this.getTerrainAreaByCoordinates(position);

    return !!terrainArea?.exitUrl;
  },

  getTerrainAreaById(id: string) {
    return this.areas.find((terrainArea) => terrainArea.id === id);
  },

  deleteSelectedTerrainArea() {
    if (!this.selectedTerrainArea) return false;

    const confirmDelete = confirm(`Are you sure to delete terrain area #"${this.selectedTerrainArea.id}"?`);

    if (!confirmDelete) return false;

    this.deleteTerrainArea(this.selectedTerrainArea.id);
    this.selectedTerrainArea = null as unknown as TerrainArea;

    return true;
  },

  deleteTerrainArea(id: string) {
    const index = this.areas.findIndex((entity) => entity.id === id);

    if (index === -1) return;

    this.areas.splice(index, 1);
  },

  getTerrainHash() {
    return this.areas
      .map((terrainArea) => {
        return [
          `${terrainArea.source.type}`,
          `${terrainArea.source.position.x1}`,
          `${terrainArea.source.position.y1}`,
          `${terrainArea.source.position.x2}`,
          `${terrainArea.source.position.y2}`,
          `${terrainArea.target.x1}`,
          `${terrainArea.target.y1}`,
          `${terrainArea.target.x2}`,
          `${terrainArea.target.y2}`,
        ].join(":");
      })
      .join("|");
  },

  getTerrainClustersHash() {
    return this.clusters
      .map((terrainCluster) => {
        return [`${terrainCluster.bg}`].join(":");
      })
      .join("|");
  },

  getTerrainClusterByCoordinates(coordinates: GridCoordinates): TerrainCluster {
    return this.clusters.find((terrainCluster) => {
      const x1 = terrainCluster.position.grid.x;
      const y1 = terrainCluster.position.grid.y;

      const x2 = x1 + constants.TERRAIN_CLUSTER_SIZE.grid.width;
      const y2 = y1 + constants.TERRAIN_CLUSTER_SIZE.grid.height;

      return coordinates.x >= x1 && coordinates.x < x2 && coordinates.y >= y1 && coordinates.y < y2;
    })!;
  },

  getTerrainAreaByCoordinates(coordinates: GridCoordinates): TerrainArea {
    const { x, y } = coordinates;

    return this.areas.find((terrainArea) => {
      const { x1, y1, x2, y2 } = terrainArea.target;

      return x >= x1 && x < x2 && y >= y1 && y < y2;
    })!;
  },

  getTerrainTileByCoordinates(coordinates: GridCoordinates): TerrainTile {
    const terrainArea = this.getTerrainAreaByCoordinates(coordinates);

    return terrainArea?.tiles[`${coordinates.x}:${coordinates.y}`];
  },
};

export const GameTerrainContext = React.createContext(gameTerrainContext);
export type GameTerrain = typeof gameTerrainContext;
