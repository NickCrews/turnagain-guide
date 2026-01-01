'use client'
// oops, does this force all children to be client components? is this bad?

import { Cartesian3, createWorldTerrainAsync, Ion, ImageryLayer, UrlTemplateImageryProvider, Viewer, NavigationHelpButton } from 'cesium';
import { createContext, useContext, useEffect, useId, useState } from 'react';
import { WORLD_IMAGERY_URL_TEMPLATE } from "../../lib/tiles";

/**
 * ViewerContext provides a shared Cesium Viewer instance across components.
 * This leads to better performance, and the viewer state like camera position
 * are saved between different pages of the app.
 * 
 * Usage:
 * 1. Wrap your app/component with ViewerProvider:
 *    ```tsx
 *    <ViewerProvider>
 *      <YourComponent />
 *    </ViewerProvider>
 *    ```
 * 
 * 2. Create an element that will hold the Cesium Viewer with a certain id,
 *    and pass it to useViewer(). Here, I'm using useId() to get a unique id for the container,
 *    but you can hardcode eg "my-map-container" if you want.
 *    ```tsx
 *    const containerId = useId();
 *    const viewer = useViewer(containerId);
 *    ...
 *    return <div id={containerId}>
 *      The already initialized singleton Viewer will get moved here on mount, and back to the parking element on unmount.
 *    </div>
 *    ```
 */
export function useViewer(containerId: string) {
  useEffect(() => {
    // move all children of parking to container
    const parkingElement = document.getElementById("cesium-parking-spot");
    const containerElement = document.getElementById(containerId);
    if (parkingElement && containerElement) {
      while (parkingElement.firstChild) {
        containerElement.appendChild(parkingElement.firstChild);
      }
    }
    return () => {
      // move all children of container to parking
      if (parkingElement && containerElement) {
        while (containerElement.firstChild) {
          parkingElement.appendChild(containerElement.firstChild);
        }
      }
    }
  }, [containerId])
  return useContext(ViewerContext);
}

const ViewerContext = createContext<Viewer | null>(null);

export function ViewerProvider({ children }: { children: React.ReactNode }) {
  // Set the limited-scope access token for prod,
  // and the default access token for dev in .env.development
  if (!process.env.NEXT_PUBLIC_CESIUM_ACCESS_TOKEN) {
    throw new Error('NEXT_PUBLIC_CESIUM_ACCESS_TOKEN is not set');
  }
  Ion.defaultAccessToken = process.env.NEXT_PUBLIC_CESIUM_ACCESS_TOKEN;

  const NAV_HELP_BUTTON_ID = 'navigationHelpButtonContainer';

  const [viewer, setViewer] = useState<Viewer | null>(null);
  const mapId = useId();

  useEffect(() => {
    async function initViewer() {
      if (viewer) {
        return;
      }

      const baseLayer = ImageryLayer.fromProviderAsync(
        // TileMapServiceImageryProvider.fromUrl(
        //   buildModuleUrl("Assets/Textures/NaturalEarthII"),
        // ),
        Promise.resolve(new UrlTemplateImageryProvider({
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
        })),
      );

      async function getTerrain() {
        try {
          // if we are offline, then we will fallback to the default smooth surface.
          return await createWorldTerrainAsync();
        } catch {
          return undefined;
        }
      }
      new NavigationHelpButton({ container: NAV_HELP_BUTTON_ID });

      const v = new Viewer(mapId, {
        geocoder: false,
        homeButton: false,
        sceneModePicker: false,
        baseLayerPicker: false,
        navigationHelpButton: false,
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
  }, [viewer, mapId])

  return <>
    <ViewerContext.Provider value={viewer}>{children}</ViewerContext.Provider>
    <div id="cesium-parking-spot" className="hidden">
      {/* Cesium will initialize the map in the div with id={containerId}.
      When a client component wants to use the map, it 
      */}
      {/* take up full width and height, the parent sets the size */}
      <div id={mapId} className="h-full w-full" />
      {/* Put in top right (the help popover always expands down and left),
        but below the filter bar */}
      <div id={NAV_HELP_BUTTON_ID} className="absolute top-[50px] right-2 z-20" />
    </div>
  </>
}
