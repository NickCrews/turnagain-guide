import { describe, it, expect } from 'vitest';
import {
  latLonToSlippy,
  boundsToSlippys,
  turnagainPassTileUrls,
  WORLD_IMAGERY_URL_TEMPLATE,
} from '@/lib/tiles';

describe('latLonToSlippy', () => {
  it('returns x and y tile coordinates', () => {
    const result = latLonToSlippy(0, 0, 0);
    expect(result).toHaveProperty('x');
    expect(result).toHaveProperty('y');
  });

  it('returns (0.5, 0.5) for (lat=0, lon=0) at zoom 0', () => {
    // At zoom 0 the whole world fits in one tile.
    // lon=0 → x = 1*(0.5 + 0/360) = 0.5
    // lat=0 → lts=0 → y = 1*(1 - 0/π)/2 = 0.5
    const { x, y } = latLonToSlippy(0, 0, 0);
    expect(x).toBeCloseTo(0.5, 5);
    expect(y).toBeCloseTo(0.5, 5);
  });

  it('returns (0, ~0) for (lat~85.05, lon=-180) at zoom 0 — top-left corner', () => {
    // lon=-180 → x = 1*(0.5 - 180/360) = 0
    const { x } = latLonToSlippy(85.0511, -180, 0);
    expect(x).toBeCloseTo(0, 5);
  });

  it('returns (1, ~1) for (lat~-85.05, lon=180) at zoom 0 — bottom-right corner', () => {
    const { x } = latLonToSlippy(-85.0511, 180, 0);
    expect(x).toBeCloseTo(1, 5);
  });

  it('x increases as longitude increases', () => {
    const a = latLonToSlippy(60, -149, 10);
    const b = latLonToSlippy(60, -148, 10);
    expect(b.x).toBeGreaterThan(a.x);
  });

  it('y increases as latitude decreases (tiles are top-down)', () => {
    const a = latLonToSlippy(61, -149, 10);
    const b = latLonToSlippy(60, -149, 10);
    expect(b.y).toBeGreaterThan(a.y);
  });

  it('doubles tile count per axis when zoom increases by 1', () => {
    // At zoom N there are 2^N tiles per axis.
    // A fixed point should have roughly doubled tile coordinates.
    const z5 = latLonToSlippy(60, -149, 5);
    const z6 = latLonToSlippy(60, -149, 6);
    expect(z6.x / z5.x).toBeCloseTo(2, 1);
  });
});

describe('boundsToSlippys', () => {
  it('returns an array of tile objects', () => {
    const result = boundsToSlippys(
      { lat1: 60, lon1: -149, lat2: 61, lon2: -148 },
      5,
    );
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBeGreaterThan(0);
    for (const tile of result) {
      expect(tile).toHaveProperty('x');
      expect(tile).toHaveProperty('y');
      expect(Number.isInteger(tile.x)).toBe(true);
      expect(Number.isInteger(tile.y)).toBe(true);
    }
  });

  it('returns exactly one tile for a point at zoom 0', () => {
    // At zoom 0 the whole world is one tile, so any bounds map to one tile.
    const result = boundsToSlippys(
      { lat1: 60, lon1: -149, lat2: 60, lon2: -149 },
      0,
    );
    expect(result).toHaveLength(1);
    expect(result[0]).toEqual({ x: 0, y: 0 });
  });

  it('handles reversed lat/lon order (lat1 > lat2)', () => {
    const normal = boundsToSlippys(
      { lat1: 60, lon1: -149, lat2: 61, lon2: -148 },
      5,
    );
    const reversed = boundsToSlippys(
      { lat1: 61, lon1: -148, lat2: 60, lon2: -149 },
      5,
    );
    expect(reversed.length).toBe(normal.length);
  });

  it('returns more tiles at higher zoom levels', () => {
    const bounds = { lat1: 60.7, lon1: -149.3, lat2: 60.86, lon2: -149.0 };
    const zoom5 = boundsToSlippys(bounds, 5);
    const zoom8 = boundsToSlippys(bounds, 8);
    expect(zoom8.length).toBeGreaterThan(zoom5.length);
  });

  it('all returned tiles have x and y within the valid range for the zoom', () => {
    const zoom = 5;
    const maxTile = 2 ** zoom;
    const result = boundsToSlippys(
      { lat1: 60.7, lon1: -149.3, lat2: 60.86, lon2: -149.0 },
      zoom,
    );
    for (const { x, y } of result) {
      expect(x).toBeGreaterThanOrEqual(0);
      expect(x).toBeLessThan(maxTile);
      expect(y).toBeGreaterThanOrEqual(0);
      expect(y).toBeLessThan(maxTile);
    }
  });
});

describe('turnagainPassTileUrls', () => {
  it('returns an array of url objects', () => {
    const results = turnagainPassTileUrls(3);
    expect(Array.isArray(results)).toBe(true);
    expect(results.length).toBeGreaterThan(0);
    for (const item of results) {
      expect(item).toHaveProperty('url');
      expect(item).toHaveProperty('revision');
      expect(item.revision).toBeNull();
    }
  });

  it('substitutes {z}, {x}, {y} placeholders in each URL', () => {
    const results = turnagainPassTileUrls(2);
    for (const { url } of results) {
      expect(url).not.toContain('{z}');
      expect(url).not.toContain('{x}');
      expect(url).not.toContain('{y}');
    }
  });

  it('produces more tiles at higher max zoom', () => {
    const zoom3 = turnagainPassTileUrls(3);
    const zoom5 = turnagainPassTileUrls(5);
    expect(zoom5.length).toBeGreaterThan(zoom3.length);
  });

  it('produces zero tiles for maxZoom=-1 (no valid zoom levels)', () => {
    // Loop runs from 0 to -1 which never executes.
    const results = turnagainPassTileUrls(-1);
    expect(results).toHaveLength(0);
  });

  it('uses the default World Imagery URL template by default', () => {
    const results = turnagainPassTileUrls(1);
    for (const { url } of results) {
      expect(url).toContain('arcgisonline.com');
    }
  });

  it('accepts a custom URL template', () => {
    const template = 'https://example.com/tiles/{z}/{x}/{y}.png';
    const results = turnagainPassTileUrls(2, template);
    for (const { url } of results) {
      expect(url).toContain('example.com');
    }
  });

  it('all URLs are unique', () => {
    const results = turnagainPassTileUrls(5);
    const urls = results.map((r) => r.url);
    const unique = new Set(urls);
    expect(unique.size).toBe(urls.length);
  });
});

describe('WORLD_IMAGERY_URL_TEMPLATE', () => {
  it('contains the required placeholders', () => {
    expect(WORLD_IMAGERY_URL_TEMPLATE).toContain('{z}');
    expect(WORLD_IMAGERY_URL_TEMPLATE).toContain('{x}');
    expect(WORLD_IMAGERY_URL_TEMPLATE).toContain('{y}');
  });

  it('is a valid HTTPS URL', () => {
    expect(WORLD_IMAGERY_URL_TEMPLATE).toMatch(/^https:\/\//);
  });
});
