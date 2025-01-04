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
  Color,
  Entity,
  ConstantProperty,
  ColorMaterialProperty,
  PolygonGraphics,
} from 'cesium'
import { useEffect, useState } from 'react'

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

  useEffect(() => {
    let viewer: Viewer | undefined;

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

      async function getTerrain() {
        try {
          // if we are offline, then we will fallback to the default smooth surface.
          return await createWorldTerrainAsync();
        } catch {
          return undefined;
        }
      }

      viewer = new Viewer('cesiumContainer', {
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

      const entities = await ItemsToEntities(items);
      setViewerEntities(viewer, entities);

      if (onItemClick) {
        const itemsById = Object.fromEntries(items.map(item => [item.id, item]));
        viewer.screenSpaceEventHandler.setInputAction((click: ScreenSpaceEventHandler.PositionedEvent) => {
          const pickedEntity: Entity | undefined = viewer?.scene.pick(click.position)?.id;
          const item = itemsById[pickedEntity?.properties?.id];
          if (item) {
            onItemClick(item);
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
    }
    if (!viewer) {
      initViewer();
    }

    return () => {
      viewer?.destroy()
    }
  }, [items, zoomTo, onItemClick])

  return <div className="relative h-full w-full">
    <div id="cesiumContainer" className="h-full w-full" />
    <div className="absolute bottom-4 right-4">
      <DownloadButton />
    </div>
  </div>
}

function DownloadButton() {
  const [isOpen, setIsOpen] = useState(false);
  return <>
    <button
      onClick={() => setIsOpen(!isOpen)}
      className="bg-black/50 hover:bg-black/70 text-white px-3 py-1 rounded-md text-sm"
    >
      Download ▾
    </button>
    {isOpen && (
      <div
        className="absolute bottom-full right-0 mb-1 bg-black/50 rounded-md overflow-hidden"
      >
        <a
          href="/turnagain-pass.geojson"
          className="block gap-1"
          download="turnagain-pass.geojson"
        >
          .geojson
        </a>
        <a
          href="/turnagain-pass.gpx"
          className="block gap-1"
          download="turnagain-pass.gpx"
        >
          .gpx
        </a>
      </div>
    )}
  </>
}

async function ItemsToEntities(items: Item[]) {
  const dataSource = await GeoJsonDataSource.load({
    type: "FeatureCollection",
    features: items.map(i => ({ ...i, properties: { ...i.properties, id: i.id } })),
  }, {
    // In a perfect world I would set each entity to clampToGround
    // in modifiedEntity(), but I can't figure out how to do it there.
    clampToGround: true,
  });
  // Warning: if the geojson contains a MultiLineString, this single feature
  // will be split into multiple entities in the GeoJsonDataSource,
  // one for each segment of the MultiLineString.
  // This might also be a problem for MultiPolygons, etc, but not sure.
  // Currently, I was able to just convert all MultiLineStrings to LineStrings
  // in the source data, but this might not always be possible.
  const entities = items.map(i => dataSource.entities.getById(i.id) as Entity);
  return entities.map(modifiedEntity);
}

function modifiedEntity(oldEntity: Entity) {
  // make a copy. This MAY not do a deep copy, IDK, watch out!
  const entity = new Entity({
    properties: oldEntity.properties,
  });
  entity.merge(oldEntity);

  if (entity.polyline) {
    entity.polyline.width = new ConstantProperty(5);
  }

  // Workaround to get polygons to show up.
  // IDK exactly why this is needed, but if you want to go down the rabbit hole:
  // https://community.cesium.com/t/polygon-clamp-to-ground-when-terrain-provider-is-used/22798/6
  if (entity.polygon) {
    entity.polygon = new PolygonGraphics({
      hierarchy: entity.polygon.hierarchy?.getValue(),
    })
  }

  if (entity.properties?.feature_type == "peak") {
    // @ts-expect-error  billboard is always present but ts doesn't know that
    entity.billboard.image = makeImageProperty(SVG_PEAK);
  } else if (entity.properties?.feature_type == "parking") {
    // @ts-expect-error  billboard is always present but ts doesn't know that
    entity.billboard.image = makeImageProperty(SVG_PARKING);
  }
  if (entity.billboard) {
    entity.billboard.width = new ConstantProperty(32);
    entity.billboard.height = new ConstantProperty(32);
  }

  let color = Color.YELLOW;
  const featureType = entity.properties?.feature_type;
  if (featureType == "uptrack") {
    color = Color.RED;
  } else if (featureType == "descent") {
    color = Color.BLUE;
  } else if (featureType == "bidirectional") {
    color = Color.PURPLE;
  }
  if (entity.polygon) {
    color = color.withAlpha(0.4);
  }
  setEntityColor(entity, color);

  return entity;
}

function setViewerEntities(viewer: Viewer, entities: Entity[]) {
  viewer.entities.removeAll();
  entities.forEach(entity => {
    viewer.entities.add(modifiedEntity(entity));
  });
}

// See /globals.css for other colors
const ICON_COLOR = "#ffffff";

const SVG_PEAK = `
  <svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100">
    <polygon points="50,10 90,90 10,90" fill="${ICON_COLOR}" />
  </svg>
`;

const SVG_PARKING = `
<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="${ICON_COLOR}">
  <path d="M240-120v-720h280q100 0 170 70t70 170q0 100-70 170t-170 70H400v240H240Zm160-400h128q33 0 56.5-23.5T608-600q0-33-23.5-56.5T528-680H400v160Z"/>
</svg>
`;

function makeImageProperty(svgString: string) {
  const blob = new Blob([svgString], { type: 'image/svg+xml' });
  const url = URL.createObjectURL(blob);
  return new ConstantProperty(url);
}

function setEntityColor(entity: Entity, color: Color) {
  if (entity.polygon) {
    entity.polygon.material = new ColorMaterialProperty(color);
  }
  if (entity.billboard) {
    entity.billboard.color = new ColorMaterialProperty(color);
  }
  if (entity.polyline) {
    entity.polyline.material = new ColorMaterialProperty(color);
  }
}