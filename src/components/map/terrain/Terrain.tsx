import React from "react";
import { WireframeTiles } from "./WireframeTiles";
import { TerrainAreas } from "./TerrainAreas";

export const Terrain = React.memo(function Terrain() {
  return (
    <>
      <WireframeTiles />
      <TerrainAreas />
    </>
  );
});
