'use client'

import {
  Viewer,
  GeoJsonDataSource,
  ImageryLayer,
  UrlTemplateImageryProvider,
  ScreenSpaceEventType,
  ScreenSpaceEventHandler,
  createWorldTerrainAsync,
  Ion,
  Cartesian3,
} from 'cesium'
import { useEffect } from 'react'

import { WORLD_IMAGERY_URL_TEMPLATE } from "../../util/tiles";
import { Item } from '../routes/routes';
import 'cesium/Build/Cesium/Widgets/widgets.css';

// Set the limited-scope access token for prod,
// and the default access token for dev in .env.development
if (!process.env.NEXT_PUBLIC_CESIUM_ACCESS_TOKEN) {
  throw new Error('NEXT_PUBLIC_CESIUM_ACCESS_TOKEN is not set');
}
Ion.defaultAccessToken = process.env.NEXT_PUBLIC_CESIUM_ACCESS_TOKEN;

interface MapStaticProps {
  items: Item[];
  /*
  // If not provided, will not zoom to anything.
  */
  zoomTo?: any;
  onItemClick?: (item: Item) => void;
}

export default function MapStatic({ items = [], zoomTo, onItemClick }: MapStaticProps) {

  async function initViewer() {
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

    const viewer = new Viewer('cesiumContainer', {
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
      terrainProvider: await createWorldTerrainAsync(),
    });
    
    if (zoomTo) {
      // The camera only moves once the provided object is loaded,
      // so be careful if you zoomto the GeoJsonDataSource.
      viewer.zoomTo(zoomTo);
    } else {
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
      viewer.scene.camera.direction = homeCameraSettings.direction;
      viewer.scene.camera.position = homeCameraSettings.position;
      viewer.scene.camera.right = homeCameraSettings.right;
      viewer.scene.camera.up = homeCameraSettings.up;

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
    }

    const dataSource = await GeoJsonDataSource.load({
      type: "FeatureCollection",
      features: items,
    }, {
      clampToGround: true,
      credit: "",
      strokeWidth: 4,
    });
    viewer.dataSources.add(dataSource);

    if (onItemClick) {
      const itemsById = Object.fromEntries(items.map(item => [item.id, item]));
      viewer.screenSpaceEventHandler.setInputAction((click: ScreenSpaceEventHandler.PositionedEvent) => {
        const pickedObject = viewer.scene.pick(click.position);
        if (pickedObject && pickedObject.id) {
          const item = itemsById[pickedObject.id.id];
          if (item) {
            onItemClick(item);
          }
        }
      }, ScreenSpaceEventType.LEFT_CLICK);
      // Change cursor to a pointer on hover
      // This works, but it is misleading: cesium seems to make it really hard to click a line.
      // Often, I can hover over a line and it will change to a pointer, but then I can't click it.
      // This is really misleading, so for now, we'll just leave the pointer as default.
      // Once I solve the difficult-to-click-line problem, I'll re-enable this.
      // viewer.screenSpaceEventHandler.setInputAction((hover: ScreenSpaceEventHandler.MotionEvent) => {
      //   const pickedObject = viewer.scene.pick(hover.endPosition);
      //   const style = pickedObject ? 'pointer' : 'default';
      //   viewer.scene.canvas.style.cursor = style;
      // }, ScreenSpaceEventType.MOUSE_MOVE);
    }
    
    return viewer;
  }

  useEffect(() => {
    let viewer: Viewer | undefined;
    initViewer().then(v => { viewer = v; });

    return () => {
      viewer?.destroy()
    }
  }, [items, zoomTo, initViewer])
  
  return <div id="cesiumContainer" className="h-full w-full" />
}