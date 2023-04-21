import React from "react";
import { WireframeTiles } from "./WireframeTiles";
import { TerrainTiles } from "./TerrainTiles";

export const Terrain = React.memo(function Terrain() {
  return (
    <>
      <WireframeTiles />
      <TerrainTiles />
    </>
  );
});
