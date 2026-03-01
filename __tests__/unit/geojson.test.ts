import { describe, it, expect, vi } from 'vitest';
import geoJSONFromGeoItems from '@/lib/geojson';

// Mock routes to avoid loading all route files
vi.mock('@/routes', () => ({ allGeoItems: [] }));

/** Minimal GeoItem fixture */
function makeItem(id: string, geometry: any = { type: 'Point', coordinates: [0, 0] }): any {
  return {
    id,
    type: 'Feature',
    geometry,
    properties: {
      title: id,
      feature_type: 'peak',
      nicks_ates_ratings: ['simple'],
      children: [],
      images: [],
    },
    proseJsx: null,
  };
}

describe('geoJSONFromGeoItems', () => {
  it('returns a valid GeoJSON FeatureCollection', () => {
    const result = geoJSONFromGeoItems([]);
    expect(result.type).toBe('FeatureCollection');
    expect(Array.isArray(result.features)).toBe(true);
  });

  it('returns an empty FeatureCollection for an empty input', () => {
    const result = geoJSONFromGeoItems([]);
    expect(result.features).toHaveLength(0);
  });

  it('maps each GeoItem to a Feature with the correct id', () => {
    const items = [makeItem('item-a'), makeItem('item-b')];
    const result = geoJSONFromGeoItems(items);
    expect(result.features).toHaveLength(2);
    expect(result.features[0].id).toBe('item-a');
    expect(result.features[1].id).toBe('item-b');
  });

  it('preserves the geometry of each item', () => {
    const geometry = { type: 'LineString', coordinates: [[-149, 60], [-148, 61]] };
    const items = [makeItem('route', geometry)];
    const result = geoJSONFromGeoItems(items);
    expect(result.features[0].geometry).toEqual(geometry);
  });

  it('preserves the properties of each item', () => {
    const items = [makeItem('peak-1')];
    const result = geoJSONFromGeoItems(items);
    expect(result.features[0].properties).toEqual(items[0].properties);
  });

  it('sets type to "Feature" on every feature', () => {
    const items = [makeItem('a'), makeItem('b'), makeItem('c')];
    const result = geoJSONFromGeoItems(items);
    for (const f of result.features) {
      expect(f.type).toBe('Feature');
    }
  });

  it('handles items with different geometry types', () => {
    const items = [
      makeItem('point', { type: 'Point', coordinates: [-149, 60, 1000] }),
      makeItem('line', {
        type: 'LineString',
        coordinates: [[-149, 60], [-148, 61]],
      }),
      makeItem('polygon', {
        type: 'Polygon',
        coordinates: [[[-149, 60], [-148, 60], [-148, 61], [-149, 61], [-149, 60]]],
      }),
    ];
    const result = geoJSONFromGeoItems(items);
    expect(result.features).toHaveLength(3);
    expect(result.features[0].geometry.type).toBe('Point');
    expect(result.features[1].geometry.type).toBe('LineString');
    expect(result.features[2].geometry.type).toBe('Polygon');
  });

  it('maintains input order', () => {
    const ids = ['z', 'a', 'm', 'b'];
    const items = ids.map((id) => makeItem(id));
    const result = geoJSONFromGeoItems(items);
    const resultIds = result.features.map((f) => f.id);
    expect(resultIds).toEqual(ids);
  });
});
