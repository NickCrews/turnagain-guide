// copied and modified from
// https://github.com/tyrasd/togpx/blob/ad56b38d393088db4753b9ae2f545dd21c88ebb4/index.js
// 
// cat public/objects.geojson | node --experimental-strip-types app/util/gpx.ts > public/turnagain-pass.gpx

import { fileURLToPath } from "url";

interface GeoJSONFeature {
  type: string;
  properties: Record<string, any>;
  geometry: {
    type: string;
    coordinates: any[];
    geometries?: any[];
  };
}

interface GPXOptions {
  // defaults to false
  includePolygons?: boolean;
  creator?: string;
  metadata?: any;
  featureTitle?: (props: Record<string, any>) => string;
  featureDescription?: (props: Record<string, any>) => string;
  featureLink?: (props: Record<string, any>) => string;
  featureCoordTimes?: ((feature: GeoJSONFeature) => any) | string;
}

interface GPXPoint {
  "@lat": number;
  "@lon": number;
  "name"?: string;
  "desc"?: string;
  "ele"?: number;
  "time"?: string;
  "link"?: {
    "@href": string;
  };
}

interface GPXTrack {
  "name"?: string;
  "desc"?: string;
  "link"?: {
    "@href": string;
  };
  "trkseg": {
    trkpt: GPXPoint[];
  }[];
}

interface GPX {
  "gpx": {
    "@xmlns": string;
    "@xmlns:xsi": string;
    "@xsi:schemaLocation": string;
    "@version": string;
    "@creator"?: string;
    "metadata": any;
    "wpt": GPXPoint[];
    "trk": GPXTrack[];
  };
}

function geojsonToGpx(geojson: any, options: GPXOptions = {}): GPX {
  const defaults: GPXOptions = {
    includePolygons: false,
    creator: "togpx",
    metadata: undefined,
    featureTitle: get_feature_title,
    featureDescription: get_feature_description,
    featureLink: undefined,
  };

  options = { ...defaults, ...options };

  // if featureCoordTimes is a string -> look for the specified property
  if (typeof options.featureCoordTimes === 'string') {
    const customTimesFieldKey = options.featureCoordTimes;
    options.featureCoordTimes = (feature: GeoJSONFeature) => {
      return feature.properties[customTimesFieldKey];
    };
  }

  function get_feature_title(props: Record<string, any>): string {
    if (!props) return "";
    if (typeof props.tags === "object") {
      const tags_title = get_feature_title(props.tags);
      if (tags_title !== "") return tags_title;
    }
    if (props.title) return props.title;
    if (props.name) return props.name;
    if (props.ref) return props.ref;
    if (props.id) return props.id;
    return "";
  }

  function get_feature_description(props: Record<string, any>): string {
    if (!props) return "";
    if (typeof props.tags === "object")
      return get_feature_description(props.tags);
    let res = "";
    for (const k in props) {
      if (typeof props[k] === "object") continue;
      res += `${k}=${props[k]}\n`;
    }
    return res.substring(0, res.length - 1);
  }

  function add_feature_link(o: GPXPoint | GPXTrack, f: GeoJSONFeature): void {
    if (options.featureLink && f.properties) {
      o.link = { "@href": options.featureLink(f.properties) };
    }
  }

  const gpx: GPX = {
    "gpx": {
      "@xmlns": "http://www.topografix.com/GPX/1/1",
      "@xmlns:xsi": "http://www.w3.org/2001/XMLSchema-instance",
      "@xsi:schemaLocation": "http://www.topografix.com/GPX/1/1 http://www.topografix.com/GPX/1/1/gpx.xsd",
      "@version": "1.1",
      "metadata": null,
      "wpt": [],
      "trk": [],
    }
  };
  if (options.creator) {
    gpx.gpx["@creator"] = options.creator;
  }
  if (options.metadata) {
    gpx.gpx.metadata = options.metadata;
  }

  let features: GeoJSONFeature[];
  if (geojson.type === "FeatureCollection") {
    features = geojson.features;
  } else if (geojson.type === "Feature") {
    features = [geojson];
  } else {
    features = [{type: "Feature", properties: {}, geometry: geojson}];
  }

  features.forEach(function mapFeature(f: GeoJSONFeature) {
    switch (f.geometry.type) {
      case "Point":
      case "MultiPoint": {
        let coords = f.geometry.coordinates;
        if (f.geometry.type === "Point") coords = [coords];
        coords.forEach((coordinates: number[]) => {
          const point: GPXPoint = {
            "@lat": coordinates[1],
            "@lon": coordinates[0],
            "name": options.featureTitle?.(f.properties),
            "desc": options.featureDescription?.(f.properties)
          };
          if (coordinates[2] !== undefined) {
            point.ele = coordinates[2];
          }
          add_feature_link(point, f);
          gpx.gpx.wpt.push(point);
        });
        break;
      }
      case "LineString":
      case "MultiLineString": {
        let coords = f.geometry.coordinates;
        if (f.geometry.type === "LineString") coords = [coords];
        const track: GPXTrack = {
          "name": options.featureTitle?.(f.properties),
          "desc": options.featureDescription?.(f.properties),
          "trkseg": []
        };
        add_feature_link(track, f);
        coords.forEach((coordinates: number[][]) => {
          const seg: {trkpt: GPXPoint[]} = {trkpt: []};
          coordinates.forEach((c: number[]) => {
            const point: GPXPoint = {
              "@lat": c[1],
              "@lon": c[0]
            };
            if (c[2] !== undefined) {
              point.ele = c[2];
            }
            seg.trkpt.push(point);
          });
          track.trkseg.push(seg);
        });
        gpx.gpx.trk.push(track);
        break;
      }
      case "Polygon":
      case "MultiPolygon": {
        if (!options.includePolygons) {
          break;
        }
        const track: GPXTrack = {
          "name": options.featureTitle?.(f.properties),
          "desc": options.featureDescription?.(f.properties),
          "trkseg": []
        };
        add_feature_link(track, f);
        let coords = f.geometry.coordinates;
        if (f.geometry.type === "Polygon") coords = [coords];
        coords.forEach((poly: number[][][]) => {
          poly.forEach((ring: number[][]) => {
            const seg: {trkpt: GPXPoint[]} = {trkpt: []};
            ring.forEach((c: number[]) => {
              const point: GPXPoint = {
                "@lat": c[1],
                "@lon": c[0]
              };
              if (c[2] !== undefined) {
                point.ele = c[2];
              }
              seg.trkpt.push(point);
            });
            track.trkseg.push(seg);
          });
        });
        gpx.gpx.trk.push(track);
        break;
      }
      case "GeometryCollection":
        (f.geometry as { geometries: any[] }).geometries.forEach((geometry: any) => {
          const pseudo_feature = {
            "properties": f.properties,
            "geometry": geometry
          };
          mapFeature(pseudo_feature as GeoJSONFeature);
        });
        break;
      default:
        console.log("warning: unsupported geometry type: " + f.geometry.type);
    }
  });
  return gpx;
}

export default geojsonToGpx;


async function cli() {
  const fs = await import('fs');
  const { XMLBuilder } = await import('fast-xml-parser');
  const geojson = JSON.parse(fs.readFileSync(0, 'utf8'));
  const gpx = geojsonToGpx(geojson);
  const builder = new XMLBuilder({attributeNamePrefix: "@", ignoreAttributes: false, format: true});
  const xml = builder.build(gpx);
  console.log(xml);
}

// if called as a script, not imported, run cli
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  cli();
}
