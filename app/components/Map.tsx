'use client'

import {
  Viewer,
  GeoJsonDataSource,
  ScreenSpaceEventType,
  ScreenSpaceEventHandler,
  Color,
  Entity,
  ConstantProperty,
  ColorMaterialProperty,
  PolygonGraphics,
} from 'cesium'
import { useEffect, useState, useId } from 'react'

import { Item } from '../routes/routes';
import 'cesium/Build/Cesium/Widgets/widgets.css';
import { useViewer } from './ViewerContext';

interface MapStaticProps {
  items: Item[];
  selectedItem?: Item;
  /*
  // If not provided, will not zoom to anything.
  */
  zoomTo?: any;
  onItemClick?: (item: Item) => void;
}

export default function MapStatic({ items = [], zoomTo, onItemClick, selectedItem }: MapStaticProps) {
  const holderId = useId();
  const viewer = useViewer(holderId);
  useEffect(() => {
    async function initViewer() {
      if (!viewer) {
        return;
      }

      if (zoomTo) {
        // The camera only moves once the provided object is loaded,
        // so be careful if you zoomto the GeoJsonDataSource.
        viewer.zoomTo(zoomTo);
      }

      let entities = await itemsToEntities(items);
      entities = entities.map(modifiedEntity);
      dullNonSelectedEntities(entities, selectedItem);
      setViewerEntities(viewer, entities);

      if (onItemClick) {
        const itemsById = Object.fromEntries(items.map(item => [item.id, item]));
        // on click, call our callback
        viewer.screenSpaceEventHandler.setInputAction((click: ScreenSpaceEventHandler.PositionedEvent) => {
          const pickedEntity: Entity | undefined = viewer?.scene.pick(click.position)?.id;
          const item = itemsById[pickedEntity?.properties?.id];
          if (item) {
            onItemClick(item);
          } 
        }, ScreenSpaceEventType.LEFT_CLICK);
        // on hover, change cursor to a pointer
        viewer.screenSpaceEventHandler.setInputAction((hover: ScreenSpaceEventHandler.MotionEvent) => {
          const pickedObject = viewer.scene.pick(hover.endPosition);
          viewer.scene.canvas.style.cursor = pickedObject ? 'pointer' : 'default';
        }, ScreenSpaceEventType.MOUSE_MOVE);
      }
    }
    initViewer();
    return () => {
      viewer?.screenSpaceEventHandler.removeInputAction(ScreenSpaceEventType.LEFT_CLICK);
    }
  }, [viewer, items, selectedItem, zoomTo, onItemClick])

  return <div className="relative h-full w-full">
    <div id={holderId} className="h-full w-full">
      {/* The singleton Viewer will get moved here on mount, and back to the parking element on unmount. */}
    </div>
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

// operates in-place
function dullNonSelectedEntities(entities: Entity[], selectedItem?: Item) {
  if (!selectedItem) {
    return entities;
  }
  entities.forEach(ent => {
    if (ent.properties?.id != selectedItem.id) {
      const color = getEntityColor(ent);
      setEntityColor(ent, color?.withAlpha(0.2) || Color.GRAY);
    }
  });
}

async function itemsToEntities(items: Item[]) {
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
  }
  if (entity.polygon) {
    color = color.withAlpha(0.2);
  }
  setEntityColor(entity, color);

  return entity;
}

function setViewerEntities(viewer: Viewer, entities: Entity[]) {
  viewer.entities.removeAll();
  entities.forEach(entity => {
    viewer.entities.add(entity);
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

function getEntityColor(entity: Entity) : Color | undefined {
  if (entity.polygon) {
    // @ts-expect-error  polygon.material is always present but ts doesn't know that
    return entity.polygon.material?.color.getValue();
  }
  if (entity.polyline) {
    // @ts-expect-error  polyline.material is always present but ts doesn't know that
    return entity.polyline.material?.color.getValue();
  }
  return undefined;
}