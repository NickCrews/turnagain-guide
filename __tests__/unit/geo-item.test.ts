import { describe, it, expect, vi } from 'vitest';
import { addChildrenField } from '@/lib/geo-item';

// Mock the @/routes module so we don't have to load all 68 JSX route files
// in unit tests. addChildrenField only takes items as a parameter anyway.
vi.mock('@/routes', () => ({ allGeoItems: [] }));

/** Minimal valid GeoItem suitable for testing addChildrenField */
function makeItem(
  id: string,
  feature_type: 'area' | 'peak' | 'ascent' | 'descent' | 'parking',
  area?: string,
): any {
  return {
    id,
    type: 'Feature',
    geometry: { type: 'Point', coordinates: [-149.0, 60.8, 1000] },
    properties: {
      title: id,
      feature_type,
      nicks_ates_ratings: [],
      children: [], // will be overwritten by addChildrenField
      images: [],
      area,
    },
    proseJsx: null,
  };
}

describe('addChildrenField', () => {
  it('returns an empty array when given an empty array', () => {
    expect(addChildrenField([])).toEqual([]);
  });

  it('sets children to an empty array for items with no children', () => {
    const items = [makeItem('area-a', 'area')];
    const result = addChildrenField(items);
    expect(result[0].properties.children).toEqual([]);
  });

  it('populates children for a parent area', () => {
    const items = [
      makeItem('my-area', 'area'),
      makeItem('peak-1', 'peak', 'my-area'),
      makeItem('peak-2', 'peak', 'my-area'),
    ];
    const result = addChildrenField(items);
    const area = result.find((i) => i.id === 'my-area')!;
    expect(area.properties.children).toContain('peak-1');
    expect(area.properties.children).toContain('peak-2');
    expect(area.properties.children).toHaveLength(2);
  });

  it('leaf items have empty children arrays', () => {
    const items = [
      makeItem('my-area', 'area'),
      makeItem('peak-1', 'peak', 'my-area'),
    ];
    const result = addChildrenField(items);
    const peak = result.find((i) => i.id === 'peak-1')!;
    expect(peak.properties.children).toEqual([]);
  });

  it('handles items without an area reference (no parent)', () => {
    const items = [
      makeItem('lone-peak', 'peak'), // no area property
    ];
    const result = addChildrenField(items);
    expect(result[0].properties.children).toEqual([]);
  });

  it('handles multiple areas each with their own children', () => {
    const items = [
      makeItem('area-a', 'area'),
      makeItem('area-b', 'area'),
      makeItem('item-a1', 'peak', 'area-a'),
      makeItem('item-a2', 'ascent', 'area-a'),
      makeItem('item-b1', 'descent', 'area-b'),
    ];
    const result = addChildrenField(items);

    const areaA = result.find((i) => i.id === 'area-a')!;
    expect(areaA.properties.children).toContain('item-a1');
    expect(areaA.properties.children).toContain('item-a2');
    expect(areaA.properties.children).toHaveLength(2);

    const areaB = result.find((i) => i.id === 'area-b')!;
    expect(areaB.properties.children).toContain('item-b1');
    expect(areaB.properties.children).toHaveLength(1);
  });

  it('throws when a child references a non-existent parent area', () => {
    const items = [
      makeItem('peak-1', 'peak', 'nonexistent-area'),
    ];
    expect(() => addChildrenField(items)).toThrow(
      'Area nonexistent-area is not a valid parent',
    );
  });

  it('preserves all other properties on each item', () => {
    const items = [
      makeItem('area-a', 'area'),
      makeItem('peak-1', 'peak', 'area-a'),
    ];
    const result = addChildrenField(items);
    const area = result.find((i) => i.id === 'area-a')!;
    expect(area.id).toBe('area-a');
    expect(area.type).toBe('Feature');
    expect(area.properties.title).toBe('area-a');
    expect(area.properties.feature_type).toBe('area');
  });

  it('does not mutate the original items', () => {
    const items = [
      makeItem('area-a', 'area'),
      makeItem('peak-1', 'peak', 'area-a'),
    ];
    const originalChildren = items[0].properties.children;
    addChildrenField(items);
    // Original item's children array should be unchanged
    expect(items[0].properties.children).toBe(originalChildren);
  });
});
