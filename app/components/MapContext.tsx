'use client'
// oops, does this force all children to be client components? is this bad?

import { Cartesian3, createWorldTerrainAsync, Ion, ImageryLayer,UrlTemplateImageryProvider, Viewer } from 'cesium';
import { createContext, useContext, useEffect, useState } from 'react';
import { WORLD_IMAGERY_URL_TEMPLATE } from "../../util/tiles";

export const MapContext = createContext<Viewer | null>(null);

export function useMapContext() {
  return useContext(MapContext);
}

export function MapContextProvider({ children }: { children: React.ReactNode }) {
  // Set the limited-scope access token for prod,
  // and the default access token for dev in .env.development
  if (!process.env.NEXT_PUBLIC_CESIUM_ACCESS_TOKEN) {
    throw new Error('NEXT_PUBLIC_CESIUM_ACCESS_TOKEN is not set');
  }
  Ion.defaultAccessToken = process.env.NEXT_PUBLIC_CESIUM_ACCESS_TOKEN;

  const [viewer, setViewer] = useState<Viewer | null>(null);

  useEffect(() => {
    async function initViewer() {
      if (viewer) {
        return;
      }

      // TS gets mad I don't provide options, but that isn't required:
      // @ts-expect-error https://github.com/CesiumGS/cesium/pull/12400
      const baseLayer = await ImageryLayer.fromProviderAsync(
        // TileMapServiceImageryProvider.fromUrl(
        //   buildModuleUrl("Assets/Textures/NaturalEarthII"),
        // ),
        new UrlTemplateImageryProvider({
          // url : 'http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png',
          // url : 'https://tile.tracestrack.com/topo__/{z}/{x}/{y}.png',
          // Thunderforest looks like a sweet indy map provider!
          // url : 'https://tile.thunderforest.com/outdoors/{z}/{x}/{y}.png?apikey=88dd993b641d4b43b1b3fea4771c2d9d',
          // url : 'https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{x}/{y}',
          // This looks pretty good!
          url: WORLD_IMAGERY_URL_TEMPLATE,
          // this doesn't include topo lines or anything else that usable
          // url : 'https://services.arcgisonline.com/ArcGIS/rest/services/Elevation/World_Hillshade_Dark/MapServer/tile/{z}/{y}/{x}',
          // url : 'https://api.maptiler.com/tiles/hillshade/{z}/{x}/{y}.webp?key=Xfb74aIJXmRrUdfJyYo5',
          credit: 'Map tiles by ArcGIS Online',
          // rectangle: Rectangle.fromDegrees(-149.2939, 60.7024, -148.8208, 60.8538),
        }),
      );

      async function getTerrain() {
        try {
          // if we are offline, then we will fallback to the default smooth surface.
          return await createWorldTerrainAsync();
        } catch {
          return undefined;
        }
      }

      const v = new Viewer('cesiumContainer', {
        geocoder: false,
        homeButton: false,
        sceneModePicker: false,
        baseLayerPicker: false,
        navigationHelpButton: true,
        animation: false,
        timeline: false,
        fullscreenButton: false,
        vrButton: false,
        infoBox: false,
        baseLayer: baseLayer,
        terrainProvider: await getTerrain(),
      });

      // found this manually flying to the camera position
      // and then printing the camera params (see below)
      // 
      // An alternative method is to set the default view rectangle, eg
      // Camera.DEFAULT_VIEW_RECTANGLE = Rectangle.fromDegrees(-149.2939, 60.7024, -148.8208, 60.8538);
      // but this defaults to an overhead, north-up view.
      const homeCameraSettings = {
        direction: new Cartesian3(
          0.3278769581030135,
          -0.2824292802463268,
          -0.9015156138440734),
        position: new Cartesian3(
          -2686319.8596728067,
          -1594796.5059449861,
          5559071.1843723655
        ),
        right: new Cartesian3(
          -0.9004902466772162,
          0.23589305569999605,
          -0.36533790100634883
        ),
        up: new Cartesian3(
          -0.3733208490919934,
          -0.8501982306268276,
          0.37120683220038514
        ),
      }
      v.scene.camera.direction = homeCameraSettings.direction;
      v.scene.camera.position = homeCameraSettings.position;
      v.scene.camera.right = homeCameraSettings.right;
      v.scene.camera.up = homeCameraSettings.up;

      // function printCamera() {
      //   var camera = viewer.scene.camera;
      //   var params = {
      //     position: camera.position.clone(),
      //     direction: camera.direction.clone(),
      //     up: camera.up.clone(),
      //     right: camera.right.clone(),
      //     transform: camera.transform.clone(),
      //     frustum: camera.frustum.clone()
      //   };
      //   console.log(params);
      // }
      // print every second
      // setInterval(printCamera, 1000);
      setViewer(v);
    }
    initViewer();

    return () => {
      viewer?.destroy()
    }
  }, [])

  return <>
    <MapContext.Provider value={viewer}>{children}</MapContext.Provider>
    <div id="cesiumContainerParking" className="hidden">
      {/* take up full width and height, the parent sets the size */}
      <div id="cesiumContainer" className="h-full w-full"/>
    </div>
  </>
}
