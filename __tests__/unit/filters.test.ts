import { describe, it, expect, vi } from 'vitest';
import { filtersToQueryString, addItemVisibility, type Filters } from '@/lib/filters';

// Mock @/routes to avoid loading all 68 JSX route files
vi.mock('@/routes', () => ({ allGeoItems: [] }));

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function makeItem(
  id: string,
  opts: {
    feature_type?: 'area' | 'peak' | 'ascent' | 'descent' | 'parking';
    area?: string;
    title?: string;
    nicks_ates_ratings?: string[];
  } = {},
): any {
  return {
    id,
    type: 'Feature',
    geometry: { type: 'Point', coordinates: [0, 0] },
    properties: {
      title: opts.title ?? id,
      feature_type: opts.feature_type ?? 'peak',
      nicks_ates_ratings: opts.nicks_ates_ratings ?? [],
      children: [],
      images: [],
      area: opts.area,
    },
    proseJsx: null,
  };
}

const emptyFilters: Filters = {
  areas: new Set(),
  types: new Set(),
  atesRatings: new Set(),
  query: '',
};

// ---------------------------------------------------------------------------
// filtersToQueryString
// ---------------------------------------------------------------------------

describe('filtersToQueryString', () => {
  it('returns an empty string when all filters are empty', () => {
    expect(filtersToQueryString(emptyFilters)).toBe('');
  });

  it('includes query when set', () => {
    const filters: Filters = { ...emptyFilters, query: 'tincan' };
    const qs = filtersToQueryString(filters);
    expect(qs).toContain('query=tincan');
  });

  it('encodes spaces in the query string', () => {
    const filters: Filters = { ...emptyFilters, query: 'tincan peak' };
    const qs = filtersToQueryString(filters);
    expect(qs).toContain('query=tincan+peak');
  });

  it('includes areas without encoding the comma separator', () => {
    const filters: Filters = {
      ...emptyFilters,
      areas: new Set(['tincan-area', 'eddies-area']),
    };
    const qs = filtersToQueryString(filters);
    // Must use plain commas, not %2C
    expect(qs).toMatch(/areas=tincan-area,eddies-area|areas=eddies-area,tincan-area/);
    expect(qs).not.toContain('%2C');
  });

  it('includes types without encoding the comma separator', () => {
    const filters: Filters = {
      ...emptyFilters,
      types: new Set(['ascent', 'descent']) as any,
    };
    const qs = filtersToQueryString(filters);
    expect(qs).toMatch(/types=ascent,descent|types=descent,ascent/);
    expect(qs).not.toContain('%2C');
  });

  it('includes ates ratings', () => {
    const filters: Filters = {
      ...emptyFilters,
      atesRatings: new Set(['simple', 'challenging']) as any,
    };
    const qs = filtersToQueryString(filters);
    expect(qs).toContain('ates=');
    expect(qs).not.toContain('%2C');
  });

  it('omits empty sets entirely', () => {
    const filters: Filters = {
      areas: new Set(['tincan-area']),
      types: new Set(),
      atesRatings: new Set(),
      query: '',
    };
    const qs = filtersToQueryString(filters);
    expect(qs).toContain('areas=');
    expect(qs).not.toContain('types=');
    expect(qs).not.toContain('ates=');
  });

  it('combines query param with set-based clauses correctly', () => {
    const filters: Filters = {
      areas: new Set(['tincan-area']),
      types: new Set(),
      atesRatings: new Set(),
      query: 'peak',
    };
    const qs = filtersToQueryString(filters);
    expect(qs).toContain('query=peak');
    expect(qs).toContain('areas=tincan-area');
    // Should be joined with &
    expect(qs).toContain('&');
  });

  it('is round-trip stable for URLSearchParams query portion', () => {
    const filters: Filters = { ...emptyFilters, query: 'hello world' };
    const qs = filtersToQueryString(filters);
    const params = new URLSearchParams(qs);
    expect(params.get('query')).toBe('hello world');
  });
});

// ---------------------------------------------------------------------------
// addItemVisibility
// ---------------------------------------------------------------------------

describe('addItemVisibility', () => {
  describe('empty filters (show everything)', () => {
    it('marks all items visible when all filters are empty', () => {
      const items = [
        makeItem('area-a', { feature_type: 'area' }),
        makeItem('peak-1', { feature_type: 'peak', area: 'area-a' }),
        makeItem('route-1', { feature_type: 'ascent', area: 'area-a' }),
      ];
      const result = addItemVisibility(items, emptyFilters, undefined);
      // areas with no filter: area items are only shown when areas filter includes them
      // non-area items: visible when areas is empty
      expect(result.find((i) => i.id === 'peak-1')!.isVisible).toBe(true);
      expect(result.find((i) => i.id === 'route-1')!.isVisible).toBe(true);
    });

    it('area items require the areas filter to include them to be visible', () => {
      const items = [makeItem('area-a', { feature_type: 'area' })];
      const result = addItemVisibility(items, emptyFilters, undefined);
      // areas filter is empty (size=0), so areas.has(item.id) is false
      expect(result[0].isVisible).toBe(false);
    });
  });

  describe('area filter', () => {
    it('shows non-area items whose area is in the filter', () => {
      const items = [
        makeItem('peak-1', { feature_type: 'peak', area: 'tincan-area' }),
        makeItem('peak-2', { feature_type: 'peak', area: 'eddies-area' }),
      ];
      const filters: Filters = {
        ...emptyFilters,
        areas: new Set(['tincan-area']),
      };
      const result = addItemVisibility(items, filters, undefined);
      expect(result.find((i) => i.id === 'peak-1')!.isVisible).toBe(true);
      expect(result.find((i) => i.id === 'peak-2')!.isVisible).toBe(false);
    });

    it('shows area items when their own id is in the areas filter', () => {
      const items = [
        makeItem('tincan-area', { feature_type: 'area' }),
        makeItem('eddies-area', { feature_type: 'area' }),
      ];
      const filters: Filters = {
        ...emptyFilters,
        areas: new Set(['tincan-area']),
      };
      const result = addItemVisibility(items, filters, undefined);
      expect(result.find((i) => i.id === 'tincan-area')!.isVisible).toBe(true);
      expect(result.find((i) => i.id === 'eddies-area')!.isVisible).toBe(false);
    });

    it('shows all non-area items when areas filter is empty', () => {
      const items = [
        makeItem('peak-1', { feature_type: 'peak', area: 'any-area' }),
      ];
      const result = addItemVisibility(items, emptyFilters, undefined);
      expect(result[0].isVisible).toBe(true);
    });

    it('hides non-area items with no area property when area filter is active', () => {
      const items = [makeItem('lone-peak', { feature_type: 'peak' })]; // no area
      const filters: Filters = {
        ...emptyFilters,
        areas: new Set(['tincan-area']),
      };
      const result = addItemVisibility(items, filters, undefined);
      // area is undefined → area ?? '' → '' not in filter
      expect(result[0].isVisible).toBe(false);
    });
  });

  describe('type filter', () => {
    it('shows only items matching the type filter', () => {
      const items = [
        makeItem('p1', { feature_type: 'peak' }),
        makeItem('a1', { feature_type: 'ascent' }),
        makeItem('d1', { feature_type: 'descent' }),
      ];
      const filters: Filters = {
        ...emptyFilters,
        types: new Set(['ascent']) as any,
      };
      const result = addItemVisibility(items, filters, undefined);
      expect(result.find((i) => i.id === 'p1')!.isVisible).toBe(false);
      expect(result.find((i) => i.id === 'a1')!.isVisible).toBe(true);
      expect(result.find((i) => i.id === 'd1')!.isVisible).toBe(false);
    });

    it('shows all items when types filter is empty', () => {
      const items = [
        makeItem('p1', { feature_type: 'peak' }),
        makeItem('a1', { feature_type: 'ascent' }),
      ];
      const result = addItemVisibility(items, emptyFilters, undefined);
      // non-area items are visible with empty area/type filters
      expect(result.find((i) => i.id === 'p1')!.isVisible).toBe(true);
      expect(result.find((i) => i.id === 'a1')!.isVisible).toBe(true);
    });
  });

  describe('ATES rating filter', () => {
    it('shows items whose ratings intersect the filter', () => {
      const items = [
        makeItem('r1', { nicks_ates_ratings: ['simple'] }),
        makeItem('r2', { nicks_ates_ratings: ['complex'] }),
        makeItem('r3', { nicks_ates_ratings: ['simple', 'challenging'] }),
      ];
      const filters: Filters = {
        ...emptyFilters,
        atesRatings: new Set(['simple']) as any,
      };
      const result = addItemVisibility(items, filters, undefined);
      expect(result.find((i) => i.id === 'r1')!.isVisible).toBe(true);
      expect(result.find((i) => i.id === 'r2')!.isVisible).toBe(false);
      expect(result.find((i) => i.id === 'r3')!.isVisible).toBe(true);
    });

    it('shows items with no ratings regardless of the ATES filter', () => {
      const items = [makeItem('no-rating', { nicks_ates_ratings: [] })];
      const filters: Filters = {
        ...emptyFilters,
        atesRatings: new Set(['extreme']) as any,
      };
      const result = addItemVisibility(items, filters, undefined);
      expect(result[0].isVisible).toBe(true);
    });

    it('shows all items when atesRatings filter is empty', () => {
      const items = [makeItem('r1', { nicks_ates_ratings: ['extreme'] })];
      const result = addItemVisibility(items, emptyFilters, undefined);
      expect(result[0].isVisible).toBe(true);
    });
  });

  describe('search query filter', () => {
    it('shows items whose title contains the query (case-insensitive)', () => {
      const items = [
        makeItem('a', { title: 'Tincan Peak' }),
        makeItem('b', { title: 'Eddies Area' }),
      ];
      const filters: Filters = { ...emptyFilters, query: 'tincan' };
      const result = addItemVisibility(items, filters, undefined);
      expect(result.find((i) => i.id === 'a')!.isVisible).toBe(true);
      expect(result.find((i) => i.id === 'b')!.isVisible).toBe(false);
    });

    it('matches all space-separated terms (AND logic)', () => {
      const items = [
        makeItem('a', { title: 'Tincan Peak' }),
        makeItem('b', { title: 'Tincan Area' }),
        makeItem('c', { title: 'Eddies Peak' }),
      ];
      const filters: Filters = { ...emptyFilters, query: 'tincan peak' };
      const result = addItemVisibility(items, filters, undefined);
      expect(result.find((i) => i.id === 'a')!.isVisible).toBe(true);
      expect(result.find((i) => i.id === 'b')!.isVisible).toBe(false);
      expect(result.find((i) => i.id === 'c')!.isVisible).toBe(false);
    });

    it('is case-insensitive', () => {
      const items = [makeItem('a', { title: 'Sunburst Ridge Uptrack' })];
      const filters: Filters = { ...emptyFilters, query: 'SUNBURST' };
      const result = addItemVisibility(items, filters, undefined);
      expect(result[0].isVisible).toBe(true);
    });

    it('shows all items when query is empty', () => {
      const items = [makeItem('a', { title: 'Anything' })];
      const result = addItemVisibility(items, emptyFilters, undefined);
      expect(result[0].isVisible).toBe(true);
    });
  });

  describe('selected item override', () => {
    it('always shows the selected item regardless of filters', () => {
      const items = [
        makeItem('selected-peak', { feature_type: 'peak', area: 'some-area' }),
      ];
      // Active area filter that would normally hide this item
      const filters: Filters = {
        ...emptyFilters,
        areas: new Set(['different-area']),
        types: new Set(['ascent']) as any,
        query: 'zzz-no-match',
      };
      const result = addItemVisibility(items, filters, 'selected-peak');
      expect(result[0].isVisible).toBe(true);
    });

    it('does not force visibility for non-selected items', () => {
      const items = [
        makeItem('a'),
        makeItem('b'),
      ];
      const filters: Filters = { ...emptyFilters, query: 'zzz-no-match' };
      const result = addItemVisibility(items, filters, 'a');
      expect(result.find((i) => i.id === 'a')!.isVisible).toBe(true);
      expect(result.find((i) => i.id === 'b')!.isVisible).toBe(false);
    });
  });

  describe('output shape', () => {
    it('returns the same number of items as the input', () => {
      const items = [makeItem('a'), makeItem('b'), makeItem('c')];
      const result = addItemVisibility(items, emptyFilters, undefined);
      expect(result).toHaveLength(3);
    });

    it('adds the isVisible property to each item', () => {
      const items = [makeItem('a')];
      const result = addItemVisibility(items, emptyFilters, undefined);
      expect(result[0]).toHaveProperty('isVisible');
      expect(typeof result[0].isVisible).toBe('boolean');
    });

    it('preserves all original item properties', () => {
      const item = makeItem('test-peak', { feature_type: 'peak', title: 'Test Peak' });
      const result = addItemVisibility([item], emptyFilters, undefined);
      expect(result[0].id).toBe('test-peak');
      expect(result[0].properties.title).toBe('Test Peak');
      expect(result[0].properties.feature_type).toBe('peak');
    });

    it('does not mutate the input array', () => {
      const items = [makeItem('a')];
      addItemVisibility(items, emptyFilters, undefined);
      expect((items[0] as any).isVisible).toBeUndefined();
    });
  });
});
