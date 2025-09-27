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
import { useEffect, useState, useId, useRef, useMemo } from 'react'

import { type GeoItem } from '@/lib/geo-item';
import { useDebounce } from '@/lib/debounce';
import RouteCard from './RouteCard';
import 'cesium/Build/Cesium/Widgets/widgets.css';
import { useViewer } from '@/app/components/ViewerContext';
import { atesColor, maxAtes } from '@/lib/terrain-rating';
import { type ItemWithVisibility } from './ItemExplorer';

interface MapProps {
  items: ItemWithVisibility[];
  selectedItem?: GeoItem | null;
  setSelectedItem?: (item: GeoItem | null) => void;
}

interface PopupInfo {
  item: GeoItem;
  position: Cartesian3;
}

function fixupItemVisibilities(items: ItemWithVisibility[], selectedItem?: GeoItem | null, popupItem?: GeoItem | null) {
  const isVisible = (item: ItemWithVisibility) => {
    if (selectedItem || popupItem) {
      const isInArea = selectedItem?.properties.feature_type === 'area' ? item.properties.area === selectedItem.id : false;
      return item.id === selectedItem?.id || item.id === popupItem?.id || isInArea;
    }
    return item.isVisible;
  }
  return items.map(item => ({
    ...item,
    isVisible: isVisible(item),
  }));
}

export default function Map({ items, setSelectedItem, selectedItem }: MapProps) {
  const holderId = useId();
  const viewer = useViewer(holderId);
  const popupRef = useRef<HTMLDivElement>(null);
  const [popupInfo, setPopupInfo] = useState<PopupInfo | null>(null);
  const popupItem = popupInfo?.item;
  items = useMemo(() => fixupItemVisibilities(items, selectedItem, popupItem), [items, selectedItem, popupItem]);
  const itemsById = Object.fromEntries(items.map(item => [item.id, item]));

  const delayedSetPopupInfo = useDebounce(setPopupInfo, 300);

  useEffect(() => {
    async function initViewerAndEntities() {
      if (!viewer) {
        return;
      }
      const entities = await itemsToEntities(items);
      const toRemove = viewer.entities.values.filter(e => !itemsById[e.properties!.id!.getValue()]);
      const toAdd = entities.filter(e => !viewer.entities.getById(e.properties!.id!.getValue()));
      const toUpdate = viewer.entities.values.filter(e => itemsById[e.properties!.id!.getValue()]);
      console.log("Entities: have", viewer.entities.values.length, "add", toAdd.length, "update", toUpdate.length, "remove", toRemove.length);
      toRemove.forEach(e => viewer.entities.remove(e));
      toAdd.forEach(e => {
        const item = itemsById[e.properties!.id!.getValue()];
        if (!item) {
          throw new Error(`item not found for entity ${e.properties?.id}`);
        }
        fixAndStyleEntity(item, e);
        viewer.entities.add(e);
      });
      toUpdate.forEach(e => {
        const item = itemsById[e.properties!.id!.getValue()];
        if (!item) {
          throw new Error(`item not found for entity ${e.properties?.id}`);
        }
        fixAndStyleEntity(item, e);
      });
    }
    initViewerAndEntities();
  }, [viewer, items, itemsById]);

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
  }, [viewer, items, setSelectedItem, itemsById])

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
    const canvasPosition = new Cartesian2();  // reduce number of allocations in tight loop
    const removeListener = viewer.scene.preRender.addEventListener(function () {
      viewer.scene.cartesianToCanvasCoordinates(popupInfo.position, canvasPosition);
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

async function itemsToEntities(items: ItemWithVisibility[]) {
  // TODO: memoize this if everything besides the visibility is unchanged
  const dataSource = await GeoJsonDataSource.load({
    type: "FeatureCollection",
    features: items.map(i => ({ ...i, properties: {...i.properties, id: i.id } })),
  }, {
    // In a perfect world I would set each entity to clampToGround
    // in modifiedEntity(), but I can't figure out how to do it there.
    clampToGround: true,
  });
  const entities = dataSource.entities.values;
  return entities;
}

/**
 * Mutates the entity in-place to fix the style
 */
function fixAndStyleEntity(item: ItemWithVisibility, entity: Entity): void {
  // Warning: if the geojson contains a MultiLineString, this single feature
  // will be split into multiple entities in the GeoJsonDataSource,
  // one for each segment of the MultiLineString.
  // This might also be a problem for MultiPolygons, etc, but not sure.
  // Currently, I was able to just convert all MultiLineStrings to LineStrings
  // in the source data, but this might not always be possible.
  if (item.geometry.type == "MultiLineString") {
    throw new Error(`item is a "MultiLineString", but should be a LineString: ${item.id}`);
  }
  if (item.geometry.type == "MultiPolygon") {
    throw new Error(`item is a "MultiPolygon", but should be a Polygon: ${item.id}`);
  }

  const id = item.id;
  const featureType = item.properties.feature_type;
  const atesRatings = item.properties.nicks_ates_ratings;
  const cssColor = (atesRatings.length > 0) ? atesColor(maxAtes(atesRatings)) : 'black';
  let color = Color.fromCssColorString(cssColor);

  // Workaround to get polygons to show up.
  // IDK exactly why this is needed, but if you want to go down the rabbit hole:
  // https://community.cesium.com/t/polygon-clamp-to-ground-when-terrain-provider-is-used/22798/6
  if (entity.polygon) {
    color = item.isVisible ? color.withAlpha(0.5) : color.withAlpha(0.1);
    entity.polygon = new PolygonGraphics({
      hierarchy: entity.polygon.hierarchy?.getValue(),
      material: new ColorMaterialProperty(color),
      // These outline properties don't seem to do anything?
      // So instead we add a PolylineGraphics perimeter below.
      // outline: true,
      // outlineColor: new ConstantProperty(Color.CORAL),
      // outlineWidth: 5,
    });
    // Add a perimeter line, since outline on the PolygonGrpahics doesn't seem to work.
    const outlineColor = item.isVisible ? color.withAlpha(1.0) : color.withAlpha(0.1);
    entity.polyline = new PolylineGraphics({
      positions: entity.polygon.hierarchy?.getValue().positions,
      material: new ColorMaterialProperty(outlineColor),
      width: new ConstantProperty(2),
      clampToGround: true,
    });
    //
  } else if (entity.polyline) {
    color = item.isVisible ? color : color.withAlpha(0.2);
    entity.polyline.width = new ConstantProperty(5);
    entity.polyline.material = new ColorMaterialProperty(color);
  } else if (entity.billboard) {
    color = item.isVisible ? color : color.withAlpha(0.2);
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
    throw new Error(`entity is not a billboard, polygon, or polyline: ${id}`);
  }

  // Ensure any 'area' features are rendered as polylines
  // so that they show up on the map as a perimeter, instead of a filled area
  if (item.properties.feature_type == 'area') {
    const positions = entity.polygon?.hierarchy ? entity.polygon.hierarchy?.getValue().positions : entity.polyline?.positions?.getValue();
    color = Color.YELLOW;
    color = item.isVisible ? color.withAlpha(.8) : color.withAlpha(0);
    entity.polyline = new PolylineGraphics({
      positions: positions,
      material: new ColorMaterialProperty(color),
      width: new ConstantProperty(8),
      clampToGround: true,
    });
    entity.polygon = undefined;
  }

  // if (id === "magnum-front-face"){
  //   console.log("styled entity", id, entity);
  // }
  // console.log(`Styled entity ${id} (${featureType}) with color ${color.toCssHexString()} and opacity ${color.alpha}, visible=${item.isVisible}`);
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