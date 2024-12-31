'use client'

import {
  Viewer,
  GeoJsonDataSource,
  ImageryLayer,
  UrlTemplateImageryProvider,
  ScreenSpaceEventType,
  ScreenSpaceEventHandler,
} from 'cesium'
import { useEffect, useState } from 'react'

import { WORLD_IMAGERY_URL_TEMPLATE } from "../../util/tiles";
import { Item } from '../routes/routes';

interface MapStaticProps {
  items: Item[];
  /*
  // If false, it will not zoom to anything.
  // The default is to zoomTo of the geojson.
  // If you want to zoom to a different object, pass that object
  */
  zoomTo?: false | any;
  onItemClick?: (item: Item) => void;
}

export default function MapStatic({ items = [], zoomTo, onItemClick }: MapStaticProps) {

  const [dataSource, setDataSource] = useState<GeoJsonDataSource | null>(null);

  useEffect(() => {
    async function loadData() {
      const newDataSource = await GeoJsonDataSource.load({
        type: "FeatureCollection",
        features: items,
      }, {
        clampToGround: true,
        credit: "",
      });
      setDataSource(newDataSource);
    }
    loadData();
  }, [items]);

  if (zoomTo === undefined) {
    zoomTo = dataSource;
  }

  useEffect(() => {
    // TS gets mad I don't provide options, but that isn't required:
    // https://github.com/CesiumGS/cesium/pull/12400
    // @ts-expect-error
    const baseLayer = ImageryLayer.fromProviderAsync(
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
      // terrainProvider: await createWorldTerrainAsync(),
      baseLayer: baseLayer,
    });

    if (dataSource !== null) {
      viewer.dataSources.add(dataSource);
    }

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
    }

    if (zoomTo !== false && zoomTo !== null) {
      viewer.zoomTo(zoomTo);
    }

    return () => {
      viewer.destroy()
    }
  }, [dataSource, zoomTo])
  return <div id="cesiumContainer" className="h-full w-full" />
}