import { describe, it, expect } from 'vitest';
import gpxFromGeojson from '@/lib/gpx';

describe('gpxFromGeojson', () => {
  describe('basic structure', () => {
    it('returns a GPX object with the correct namespace', () => {
      const result = gpxFromGeojson({ type: 'FeatureCollection', features: [] });
      expect(result.gpx['@xmlns']).toBe('http://www.topografix.com/GPX/1/1');
      expect(result.gpx['@version']).toBe('1.1');
    });

    it('sets the default creator to "togpx"', () => {
      const result = gpxFromGeojson({ type: 'FeatureCollection', features: [] });
      expect(result.gpx['@creator']).toBe('togpx');
    });

    it('accepts a custom creator via options', () => {
      const result = gpxFromGeojson(
        { type: 'FeatureCollection', features: [] },
        { creator: 'my-app' },
      );
      expect(result.gpx['@creator']).toBe('my-app');
    });

    it('starts with empty waypoints and tracks', () => {
      const result = gpxFromGeojson({ type: 'FeatureCollection', features: [] });
      expect(result.gpx.wpt).toEqual([]);
      expect(result.gpx.trk).toEqual([]);
    });

    it('includes metadata when provided', () => {
      const meta = { name: 'My Tour' };
      const result = gpxFromGeojson(
        { type: 'FeatureCollection', features: [] },
        { metadata: meta },
      );
      expect(result.gpx.metadata).toEqual(meta);
    });
  });

  describe('Point geometry', () => {
    const pointFeature = {
      type: 'FeatureCollection',
      features: [
        {
          type: 'Feature',
          properties: { title: 'Tincan Peak', name: undefined },
          geometry: { type: 'Point', coordinates: [-149.1, 60.8, 1220] },
        },
      ],
    };

    it('converts a Point to a waypoint', () => {
      const result = gpxFromGeojson(pointFeature);
      expect(result.gpx.wpt).toHaveLength(1);
      expect(result.gpx.trk).toHaveLength(0);
    });

    it('sets lat/lon correctly (coordinates are [lon, lat, ele])', () => {
      const result = gpxFromGeojson(pointFeature);
      const wpt = result.gpx.wpt[0];
      expect(wpt['@lat']).toBeCloseTo(60.8);
      expect(wpt['@lon']).toBeCloseTo(-149.1);
    });

    it('sets elevation when the third coordinate is present', () => {
      const result = gpxFromGeojson(pointFeature);
      expect(result.gpx.wpt[0].ele).toBeCloseTo(1220);
    });

    it('omits elevation when the third coordinate is absent', () => {
      const noEle = {
        type: 'FeatureCollection',
        features: [
          {
            type: 'Feature',
            properties: {},
            geometry: { type: 'Point', coordinates: [-149.1, 60.8] },
          },
        ],
      };
      const result = gpxFromGeojson(noEle);
      expect(result.gpx.wpt[0].ele).toBeUndefined();
    });

    it('uses the title property as the waypoint name', () => {
      const result = gpxFromGeojson(pointFeature);
      expect(result.gpx.wpt[0].name).toBe('Tincan Peak');
    });

    it('handles MultiPoint geometry', () => {
      const multi = {
        type: 'FeatureCollection',
        features: [
          {
            type: 'Feature',
            properties: {},
            geometry: {
              type: 'MultiPoint',
              coordinates: [[-149, 60], [-148, 61]],
            },
          },
        ],
      };
      const result = gpxFromGeojson(multi);
      expect(result.gpx.wpt).toHaveLength(2);
    });
  });

  describe('LineString geometry', () => {
    const lineFeature = {
      type: 'FeatureCollection',
      features: [
        {
          type: 'Feature',
          properties: { title: 'Sunburst Uptrack' },
          geometry: {
            type: 'LineString',
            coordinates: [
              [-149.1, 60.7, 1000],
              [-149.05, 60.75, 1100],
              [-149.0, 60.8, 1200],
            ],
          },
        },
      ],
    };

    it('converts a LineString to a track', () => {
      const result = gpxFromGeojson(lineFeature);
      expect(result.gpx.trk).toHaveLength(1);
      expect(result.gpx.wpt).toHaveLength(0);
    });

    it('creates one track segment with the correct number of points', () => {
      const result = gpxFromGeojson(lineFeature);
      const trk = result.gpx.trk[0];
      expect(trk.trkseg).toHaveLength(1);
      expect(trk.trkseg[0].trkpt).toHaveLength(3);
    });

    it('sets lat/lon on track points correctly', () => {
      const result = gpxFromGeojson(lineFeature);
      const pts = result.gpx.trk[0].trkseg[0].trkpt;
      expect(pts[0]['@lat']).toBeCloseTo(60.7);
      expect(pts[0]['@lon']).toBeCloseTo(-149.1);
      expect(pts[2]['@lat']).toBeCloseTo(60.8);
    });

    it('sets elevation on track points when present', () => {
      const result = gpxFromGeojson(lineFeature);
      const pts = result.gpx.trk[0].trkseg[0].trkpt;
      expect(pts[0].ele).toBeCloseTo(1000);
      expect(pts[1].ele).toBeCloseTo(1100);
      expect(pts[2].ele).toBeCloseTo(1200);
    });

    it('handles MultiLineString geometry', () => {
      const multi = {
        type: 'FeatureCollection',
        features: [
          {
            type: 'Feature',
            properties: {},
            geometry: {
              type: 'MultiLineString',
              coordinates: [
                [[-149, 60], [-148, 61]],
                [[-147, 59], [-146, 58]],
              ],
            },
          },
        ],
      };
      const result = gpxFromGeojson(multi);
      expect(result.gpx.trk).toHaveLength(1);
      expect(result.gpx.trk[0].trkseg).toHaveLength(2);
    });
  });

  describe('Polygon geometry', () => {
    const polygonFeature = {
      type: 'FeatureCollection',
      features: [
        {
          type: 'Feature',
          properties: { title: 'Eddies Area' },
          geometry: {
            type: 'Polygon',
            coordinates: [
              [[-149, 60], [-148, 60], [-148, 61], [-149, 61], [-149, 60]],
            ],
          },
        },
      ],
    };

    it('ignores Polygon by default (includePolygons=false)', () => {
      const result = gpxFromGeojson(polygonFeature);
      expect(result.gpx.trk).toHaveLength(0);
      expect(result.gpx.wpt).toHaveLength(0);
    });

    it('includes Polygon as a track when includePolygons=true', () => {
      const result = gpxFromGeojson(polygonFeature, { includePolygons: true });
      expect(result.gpx.trk).toHaveLength(1);
      expect(result.gpx.trk[0].trkseg).toHaveLength(1);
      expect(result.gpx.trk[0].trkseg[0].trkpt).toHaveLength(5);
    });
  });

  describe('GeometryCollection', () => {
    it('processes each geometry within a GeometryCollection', () => {
      const gc = {
        type: 'FeatureCollection',
        features: [
          {
            type: 'Feature',
            properties: { title: 'Mixed' },
            geometry: {
              type: 'GeometryCollection',
              geometries: [
                { type: 'Point', coordinates: [-149, 60] },
                { type: 'LineString', coordinates: [[-149, 60], [-148, 61]] },
              ],
            },
          },
        ],
      };
      const result = gpxFromGeojson(gc);
      expect(result.gpx.wpt).toHaveLength(1);
      expect(result.gpx.trk).toHaveLength(1);
    });
  });

  describe('title and description extraction', () => {
    it('uses props.title as the feature title', () => {
      const f = {
        type: 'Feature',
        properties: { title: 'My Route' },
        geometry: { type: 'Point', coordinates: [-149, 60] },
      };
      const result = gpxFromGeojson(f);
      expect(result.gpx.wpt[0].name).toBe('My Route');
    });

    it('falls back to props.name when no title', () => {
      const f = {
        type: 'Feature',
        properties: { name: 'Fallback Name' },
        geometry: { type: 'Point', coordinates: [-149, 60] },
      };
      const result = gpxFromGeojson(f);
      expect(result.gpx.wpt[0].name).toBe('Fallback Name');
    });

    it('returns empty string as name when no identifying property exists', () => {
      const f = {
        type: 'Feature',
        properties: {},
        geometry: { type: 'Point', coordinates: [-149, 60] },
      };
      const result = gpxFromGeojson(f);
      expect(result.gpx.wpt[0].name).toBe('');
    });
  });

  describe('single Feature input (not FeatureCollection)', () => {
    it('accepts a single Feature directly', () => {
      const f = {
        type: 'Feature',
        properties: { title: 'Lone Point' },
        geometry: { type: 'Point', coordinates: [-149, 60] },
      };
      const result = gpxFromGeojson(f);
      expect(result.gpx.wpt).toHaveLength(1);
    });
  });

  describe('bare Geometry input', () => {
    it('accepts a bare geometry object', () => {
      const g = { type: 'Point', coordinates: [-149, 60] };
      const result = gpxFromGeojson(g);
      expect(result.gpx.wpt).toHaveLength(1);
    });
  });

  describe('featureLink option', () => {
    it('adds a link to waypoints when featureLink is provided', () => {
      const f = {
        type: 'Feature',
        properties: { title: 'Test', id: 'test-id' },
        geometry: { type: 'Point', coordinates: [-149, 60] },
      };
      const result = gpxFromGeojson(f, {
        featureLink: (props) => `https://example.com/${props.id}`,
      });
      expect(result.gpx.wpt[0].link).toEqual({ '@href': 'https://example.com/test-id' });
    });
  });
});
