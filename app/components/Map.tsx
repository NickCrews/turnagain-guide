'use client'

import {
  GeoJsonDataSource,
  ScreenSpaceEventType,
  ScreenSpaceEventHandler,
  Color,
  Entity,
  BoundingSphere,
  ConstantProperty,
  ColorMaterialProperty,
  PolygonGraphics,
  PolylineGraphics,
  Cartesian2,
  Cartesian3,
  Viewer,
} from 'cesium'
import { useEffect, useState, useId, useRef, useMemo} from 'react'

import { FeatureType, GeoItem } from '@/lib/geo-item';
import { useDebounce } from '@/lib/debounce';
import RouteCard from './RouteCard';
import 'cesium/Build/Cesium/Widgets/widgets.css';
import { useViewer } from '@/app/components/ViewerContext';
import { ATES, atesColor, maxAtes } from '@/lib/terrain-rating';
import { areaColor } from './Area';

interface MapProps {
  items: GeoItem[];
  selectedItem?: GeoItem;
  setSelectedItem?: (item: GeoItem | null) => void;
}

interface PopupInfo {
  item: GeoItem;
  position: Cartesian3;
}

function getNonDullItems(items: GeoItem[], selectedItem?: GeoItem, popupItem?: GeoItem) {
  let nonDullItems = []
  if (selectedItem) {
    nonDullItems.push(selectedItem);
  }
  if (popupItem) {
    nonDullItems.push(popupItem);
  }
  if (nonDullItems.length == 0) {
    nonDullItems = items;
  }
  return nonDullItems;
}

export default function Map({ items = [], setSelectedItem, selectedItem }: MapProps) {
  const holderId = useId();
  const viewer = useViewer(holderId);
  const popupRef = useRef<HTMLDivElement>(null);
  const [popupInfo, setPopupInfo] = useState<PopupInfo | null>(null);
  const popupItem = popupInfo?.item;
  const nonDullItems = useMemo(() => getNonDullItems(items, selectedItem, popupItem), [items, selectedItem, popupItem]);
  const itemsById = Object.fromEntries(items.map(item => [item.id, item]));

  const delayedSetPopupInfo = useDebounce(setPopupInfo, 300);

  useEffect(() => {
    async function initViewerAndEntities() {
      if (!viewer) {
        return;
      }
      const entities = await itemsToEntities(items);
      entities.forEach(entity => {
        if (viewer.entities.values.some(e => e.properties?.id?.getValue() == entity.properties?.id?.getValue())) {
          return;
        }
        viewer.entities.add(entity);
      });
    }
    initViewerAndEntities();
  }, [viewer, items])

  useEffect(() => {
    // update the style of all the existing entities
    // console.log("styleEntities", items.length, nonDullItems.length);
    viewer?.entities.values.forEach(entity => styleEntity(entity, nonDullItems));
  }, [viewer, items, nonDullItems])

  useEffect(() => {
    if (!viewer || !setSelectedItem) {
      return;
    }
    const handleClick = (click: ScreenSpaceEventHandler.PositionedEvent) => {
      const entity = pickEntity(click.position, viewer);
      const item: GeoItem | null = itemsById[entity?.properties?.id];
      setSelectedItem(item);
    };
    viewer.screenSpaceEventHandler.setInputAction(handleClick, ScreenSpaceEventType.LEFT_CLICK);
    return () => viewer?.screenSpaceEventHandler.removeInputAction(ScreenSpaceEventType.LEFT_CLICK);
  }, [viewer, items])

  useEffect(() => {
    if (!viewer) {
      return;
    }
    const handleHover = (hover: ScreenSpaceEventHandler.MotionEvent) => {
      const entity = pickEntity(hover.endPosition, viewer);
      const item: GeoItem | null = entity ? itemsById[entity.properties?.id] : null;
      viewer.scene.canvas.style.cursor = entity ? 'pointer' : 'default';
      const position = viewer.scene.pickPosition(hover.endPosition);
      const popupInfo = item ? { item, position } : null;
      delayedSetPopupInfo(popupInfo);
    };
    viewer.screenSpaceEventHandler.setInputAction(handleHover, ScreenSpaceEventType.MOUSE_MOVE);
    return () => viewer?.screenSpaceEventHandler.removeInputAction(ScreenSpaceEventType.MOUSE_MOVE);
  }, [viewer, itemsById, delayedSetPopupInfo])

  useEffect(() => {
    if (!viewer || !popupInfo || !popupRef.current) {
      return;
    }
    const htmlOverlay = popupRef.current;
    const scratch2d = new Cartesian2();  // reduce number of allocations in tight loop
    const removeListener = viewer.scene.preRender.addEventListener(function () {
      const canvasPosition = viewer.scene.cartesianToCanvasCoordinates(
        popupInfo.position,
        scratch2d
      );
      htmlOverlay.style.top = canvasPosition.y + "px";
      htmlOverlay.style.left = canvasPosition.x + "px";
    });
    return removeListener;
  }, [viewer, popupInfo])

  return <div className="relative h-full w-full overflow-hidden">
    <div id={holderId} className="h-full w-full">
      {/* The singleton Viewer will get moved here on mount, and back to the parking element on unmount. */}
    </div>
    <div ref={popupRef} className="absolute -translate-x-1/2 -translate-y-full w-64">
      {popupInfo && <RouteCard item={popupInfo.item} onClick={setSelectedItem} />}
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
      className="bg-background/50 hover:bg-background/70 text-foreground px-3 py-1 rounded-md text-sm"
    >
      Download ▾
    </button>
    {isOpen && (
      <div
        className="absolute bottom-full right-0 mb-1 bg-background/50 rounded-md overflow-hidden"
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

async function itemsToEntities(items: GeoItem[]) {
  const dataSource = await GeoJsonDataSource.load({
    type: "FeatureCollection",
    features: items.map(i => ({ ...i, properties: { ...i.properties, id: i.id } })),
    // features: items.map(i => ({ id: i.id, geometry: i.geometry, properties: { ...i.properties, id: i.id } })),
  }, {
    // In a perfect world I would set each entity to clampToGround
    // in modifiedEntity(), but I can't figure out how to do it there.
    clampToGround: true,
  });
  return items.map(i => fixupEntity(i, dataSource.entities.getById(i.id) as Entity));
}

function fixupEntity(item: GeoItem, entity: Entity) {
  // Warning: if the geojson contains a MultiLineString, this single feature
  // will be split into multiple entities in the GeoJsonDataSource,
  // one for each segment of the MultiLineString.
  // This might also be a problem for MultiPolygons, etc, but not sure.
  // Currently, I was able to just convert all MultiLineStrings to LineStrings
  // in the source data, but this might not always be possible.

  // Workaround to get polygons to show up.
  // IDK exactly why this is needed, but if you want to go down the rabbit hole:
  // https://community.cesium.com/t/polygon-clamp-to-ground-when-terrain-provider-is-used/22798/6
  if (entity.polygon) {
    entity.polygon = new PolygonGraphics({
      hierarchy: entity.polygon.hierarchy?.getValue(),
    })
  }
  
  if (entity.polyline) {
    entity.polyline.width = new ConstantProperty(5);
  }
  
  // convert any 'area' feature types from Polygon to LineString
  // so that they show up on the map as a perimeter, instead of a filled area
  if (item.properties.feature_type == 'area') {
    if (entity.polygon) {
      entity.polyline = new PolylineGraphics({
        positions: entity.polygon.hierarchy?.getValue().positions,
        width: new ConstantProperty(5),
        clampToGround: true,
      });
      entity.polygon = undefined;
    }
  }

  return entity;
}

// edits in-place
function styleEntity(entity: Entity, nonDullItems: GeoItem[]) {
  const featureType: FeatureType = entity.properties?.feature_type;
  const atesRatings: ATES[] = entity.properties?.nicks_ates_ratings.getValue();
  const cssColor = (atesRatings.length > 0) ? atesColor(maxAtes(atesRatings)) : 'black';
  let color = Color.fromCssColorString(cssColor);
  if (featureType == "area") {
    color = Color.fromCssColorString(areaColor(entity.properties?.id.getValue()));
  }
  
  const nonDull = nonDullItems.some(item => item.id == entity.properties?.id);
  const dull = !nonDull;
  
  if (entity.polygon) {
    if (dull) {
      color = color.withAlpha(0.1);
    } else {
      color = color.withAlpha(0.5);
    }
  } else if (entity.billboard) {
    if (dull) {
      color = color.withAlpha(0.2);
    } else {
      color = color;
    }
  } else {
    if (dull) {
      color = color.withAlpha(0.2);
    } else {
      color = color;
    }
  }

  if (entity.polygon) {
    entity.polygon.material = new ColorMaterialProperty(color);
  } else if (entity.polyline) {
    entity.polyline.material = new ColorMaterialProperty(color);
  } else if (entity.billboard) {
    if (featureType == "peak") {
      entity.billboard.image = makeImageProperty(SVG_PEAK, color);
    } else if (featureType == "parking") {
      entity.billboard.image = makeImageProperty(SVG_PARKING, color);
    } else {
      throw new Error(`Unknown feature type for billboard: ${featureType}`);
    }
    entity.billboard.width = new ConstantProperty(32);
    entity.billboard.height = new ConstantProperty(32);
  } else {
    throw new Error(`entity is not a billboard, polygon, or polyline: ${entity.properties?.id}`);
  }
}

function pickEntity(position: Cartesian2, viewer: Viewer): Entity | null {
  // scene.drill() is buggy, and if hover over a polygon draped on terrain,
  // and behind that polygon is another polygon draped on terrain,
  // then sometimes drill returns the polygon behind the first one.
  let picks = viewer.scene.drillPick(position);
  // We prioritize billboards over everything else,
  // and everything else over polygons.
  const isBillboard = (obj: any) => obj.id.billboard !== undefined;
  const isNonPolygon = (obj: any) => obj.id.polygon === undefined;
  const anyAreBillboards = picks.some(isBillboard);
  if (anyAreBillboards) {
    picks = picks.filter(isBillboard);
  }
  const anyAreNonPolygons = picks.some(isNonPolygon);
  if (anyAreNonPolygons) {
    picks = picks.filter(isNonPolygon);
  }

  let closestEntity: Entity | null = null;
  let closestDistance = Infinity;
  picks.forEach(obj => {
    const entity = obj.id as Entity;
    let entityCenter: Cartesian3;
    if (entity.polygon) {
      entityCenter = BoundingSphere.fromPoints(entity.polygon.hierarchy!.getValue().positions).center;
    } else if (entity.polyline) {
      entityCenter = BoundingSphere.fromPoints(entity.polyline.positions!.getValue()).center;
    } else if (entity.billboard) {
      entityCenter = entity.position!.getValue()!;
    } else {
      throw new Error(`entity is not a billboard, polygon, or polyline: ${entity.properties?.id}`);
    }
    const distance = Cartesian3.distance(entityCenter, viewer.camera.position);
    if (distance < closestDistance) {
      closestEntity = entity;
      closestDistance = distance;
    }
  });
  return closestEntity;
}

// a triangle like ⏶
const SVG_PEAK = `
  <svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100">
    <polygon points="50,10 90,90 10,90" fill="$ICON_COLOR" fill-opacity="$ICON_ALPHA" />
  </svg>
`;

// a "P" icon
const SVG_PARKING = `
<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="$ICON_COLOR" fill-opacity="$ICON_ALPHA">
  <path d="M240-120v-720h280q100 0 170 70t70 170q0 100-70 170t-170 70H400v240H240Zm160-400h128q33 0 56.5-23.5T608-600q0-33-23.5-56.5T528-680H400v160Z"/>
</svg>
`;

function makeImageProperty(svgString: string, color?: string | Color, alpha?: number) {
  // See /globals.css for other colors
  color = color || "#ffffff";
  if (typeof color !== "string") {
    alpha = alpha || color.alpha;
    color = color.toCssHexString().slice(0, 7);
  }
  alpha = alpha || 1;
  svgString = svgString.replace("$ICON_COLOR", color);
  svgString = svgString.replace("$ICON_ALPHA", alpha.toString());
  const blob = new Blob([svgString], { type: 'image/svg+xml' });
  const url = URL.createObjectURL(blob);
  return new ConstantProperty(url);
}