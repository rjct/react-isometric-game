import { DebugVisualization } from "@src/components/debug/DebugVisualization";
import { BuildingEditor } from "@src/components/editor/building/BuildingEditor";
import { LightEditor } from "@src/components/editor/light/LightEditor";
import { TerrainAreasEditor } from "@src/components/editor/terrain/TerrainAreasEditor";
import { UnitEditor } from "@src/components/editor/unit/UnitEditor";
import { VehicleEditor } from "@src/components/editor/vehicle/VehicleEditor";
import { Ammo } from "@src/components/viewport/layers/ammo/Ammo";
import { FogOfWarComponent } from "@src/components/viewport/layers/fogOfWar/FogOfWar";
import { LightsAndShadows } from "@src/components/viewport/layers/lightsAndShadows/LightsAndShadows";
import { MessagesTooltip } from "@src/components/viewport/layers/messages/MessagesTooltip";
import { TerrainCanvas } from "@src/components/viewport/layers/terrain/TerrainCanvas";
import { TerrainClusters } from "@src/components/viewport/layers/terrain/TerrainClusters";
import { UserInteraction } from "@src/components/viewport/layers/userInteraction/UserInteraction";
import { Wireframe } from "@src/components/viewport/layers/wireframe/Wireframe";
import { GameUI } from "@src/context/GameUIContext";
import { BuildingType } from "@src/dict/building/_building";
import { UnitType } from "@src/dict/unit/_unit";
import { VehicleType } from "@src/dict/vehicle/_vehicle";
import { Building } from "@src/engine/building/BuildingFactory";
import { constants } from "@src/engine/constants";
import { floor, getVisibleIsometricGridCells, screenToGridSpace } from "@src/engine/helpers";
import { useGameState } from "@src/hooks/useGameState";
import { useHero } from "@src/hooks/useHero";
import { useMousePosition } from "@src/hooks/useMousePosition";
import { useScene } from "@src/hooks/useScene";
import React from "react";

export type MapForwardedRefs = {
  setScroll: (position: ScreenCoordinates) => null;
};

export const Viewport = React.memo(
  React.forwardRef((_props, forwardedRefs) => {
    const { terrainState, terrainDispatch, gameState, gameDispatch, uiState, uiDispatch } = useGameState();
    const { getWorldMousePosition } = useMousePosition();
    const { hero } = useHero();
    const { checkCurrentScene } = useScene();

    const mapRef = React.useRef<HTMLDivElement>(null);

    const getDraggedEntityDataFromEvent = (e: React.DragEvent) => {
      const screen = {
        x: Math.round(
          e.clientX -
            constants.editor.entitiesLibrary.width -
            constants.tileSize.width +
            constants.tileSize.width / 2 +
            uiState.scroll.x,
        ),
        y: Math.round(e.clientY - uiState.rect.top) + uiState.scroll.y,
      };
      const grid = screenToGridSpace(screen, gameState.mapSize);

      if (
        grid.x < 0 ||
        grid.x > gameState.mapSize.width ||
        grid.y < 0 ||
        grid.y > gameState.mapSize.height ||
        e.dataTransfer.getData("add/entity") === ""
      )
        return null;

      const type = e.dataTransfer.getData("add/entity/type") as "building" | "unit" | "vehicle";
      const entity = JSON.parse(e.dataTransfer.getData("add/entity"));

      const position = { x: floor(grid.x), y: floor(grid.y) };
      const rotation = Number(e.dataTransfer.getData("add/entity/rotation")) as AngleInDegrees;
      const size = entity.size.grid;

      return {
        type,
        entity,
        position,
        rotation,
        size,
      };
    };

    const handleMouseDown = () => {
      gameDispatch({ type: "clearSelectedBuilding" });
      gameDispatch({ type: "clearSelectedVehicle" });
      terrainDispatch({ type: "clearSelectedTerrainArea" });
      gameDispatch({ type: "clearSelectedLight" });
      gameDispatch({ type: "clearSelectedUnit" });
    };

    const handleMouseMove = (e: React.MouseEvent) => {
      uiDispatch({ type: "setMousePosition", mousePosition: getWorldMousePosition(e) });
    };

    const handleMouseOut = () => {
      uiDispatch({ type: "resetMousePosition" });
    };

    const handleScroll = () => {
      if (mapRef.current) {
        uiDispatch({ type: "scrollMap", scroll: getCurrentScroll() });
        uiDispatch({ type: "setViewport", viewport: getCurrentViewport() });
      }
    };

    const handleDragOver = function (e: React.DragEvent) {
      if (uiState.scene !== "editor") return;

      e.preventDefault();
      e.dataTransfer.dropEffect = "copy";

      const draggedEntityData = getDraggedEntityDataFromEvent(e);

      if (!draggedEntityData) return;

      const { position, rotation, size } = draggedEntityData;

      gameDispatch({ type: "highlightEntityPlaceholder", size, position, rotation });
    };

    const handleDragLeave = () => {
      gameDispatch({ type: "clearEntityPlaceholder" });
    };

    const handleDrop = (e: React.DragEvent) => {
      if (uiState.scene !== "editor") return;

      e.preventDefault();

      const draggedEntityData = getDraggedEntityDataFromEvent(e);

      if (!draggedEntityData) return;

      const { type, entity, position, rotation } = draggedEntityData;

      switch (type) {
        case "building":
          gameDispatch({
            type: "addBuilding",
            buildingType: entity.type as BuildingType,
            position,
            rotation,
            variant: Number(e.dataTransfer.getData("add/entity/variant")) as Building["variant"],
          });
          break;

        case "unit":
          gameDispatch({
            type: "addUnit",
            unitType: entity.type as UnitType,
            position,
            rotation,
          });
          break;

        case "vehicle":
          gameDispatch({
            type: "addVehicle",
            vehicleType: entity.type as VehicleType,
            position,
            rotation,
          });
      }

      gameDispatch({ type: "clearEntityPlaceholder" });
    };

    const getCurrentScroll = (): GameUI["scroll"] => {
      return {
        x: mapRef.current?.scrollLeft,
        y: mapRef.current?.scrollTop,
      } as GameUI["scroll"];
    };

    const getCurrentRect = (): GameUI["rect"] => {
      return mapRef.current?.getBoundingClientRect() as GameUI["rect"];
    };

    const getCurrentViewport = (): GameUI["viewport"] => {
      const rect = getCurrentRect();
      const scroll = getCurrentScroll();

      const screen = {
        x1: rect.x + scroll.x,
        y1: rect.y + scroll.y - rect.top,
        x2: rect.width + scroll.x,
        y2: rect.height + scroll.y,
      };

      const { grid, visibleCells } = getVisibleIsometricGridCells(
        { x: screen.x1, y: screen.y1, width: rect.width, height: rect.height },
        gameState.mapSize,
      );

      return {
        screen,
        grid,
        visibleCells,
      };
    };

    React.useEffect(() => {
      if (gameState.mapSize.width === 0 || gameState.mapSize.height === 0) return;

      if (mapRef.current) {
        uiDispatch({ type: "scrollMap", scroll: getCurrentScroll() });
        uiDispatch({ type: "setMapRect", rect: getCurrentRect() });
        uiDispatch({ type: "setViewport", viewport: getCurrentViewport() });
        uiDispatch({ type: "resetMousePosition" });
        uiDispatch({
          type: "centerMapOnHero",
          unitCoordinates: hero.position.screen,
        });
      }
    }, [gameState.mapSize]);

    React.useEffect(() => {
      if (gameState.mapSize.width === 0 || gameState.mapSize.height === 0) return;

      if (mapRef.current) {
        uiDispatch({ type: "setMapRect", rect: getCurrentRect() });
        uiDispatch({ type: "setViewport", viewport: getCurrentViewport() });
        uiDispatch({ type: "resetMousePosition" });
      }
    }, [uiState.scene]);

    React.useEffect(() => {
      const { x1, y1, x2, y2 } = uiState.viewport.screen;

      const clustersInView = terrainState.clusters.filter((terrainCluster) => {
        return (
          terrainCluster.position.screen.x + constants.TERRAIN_CLUSTER_SIZE.screen.width >= x1 &&
          terrainCluster.position.screen.x <= x2 &&
          terrainCluster.position.screen.y <= y2 &&
          terrainCluster.position.screen.y + constants.TERRAIN_CLUSTER_SIZE.screen.height >= y1
        );
      });

      terrainDispatch({ type: "setTerrainClustersInView", clustersInView });
    }, [uiState.viewport.grid]);

    React.useEffect(() => {
      if (gameState.mapSize.width === 0 || gameState.mapSize.height === 0) return;

      uiDispatch({
        type: "centerMapOnHero",
        unitCoordinates: hero.position.screen,
      });
    }, [hero.position.screen]);

    React.useImperativeHandle(
      forwardedRefs,
      () => {
        return {
          setScroll: (position: ScreenCoordinates) => {
            if (mapRef.current) {
              mapRef.current.scrollTo({
                top: position.y,
                left: position.x,
                behavior: "smooth",
              });
            }
          },
        };
      },
      [],
    );

    return (
      <>
        <div
          ref={mapRef}
          className="viewport-wrapper"
          //style={{ marginTop: constants.topPanel.height }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseOut={handleMouseOut}
          onScroll={handleScroll}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <FogOfWarComponent />
          <LightsAndShadows />
          <DebugVisualization />

          <MessagesTooltip />
          <Wireframe />

          {checkCurrentScene(["editor"]) ? (
            <>
              <BuildingEditor />
              <TerrainAreasEditor />
              <UnitEditor />
              <VehicleEditor />
              <LightEditor />
            </>
          ) : null}

          <TerrainClusters workingScenes={["game", "combat"]} />
          <TerrainCanvas workingScenes={["editor"]} />

          <Ammo />
          <UserInteraction />
        </div>
      </>
    );
  }),
);
