import { type FeatureType, type GeoItem } from './geo-item';
import { type ATES } from './terrain-rating';

export interface Filters {
  areas: Set<string>;
  types: Set<FeatureType>;
  atesRatings: Set<ATES>;
  query: string;
}

// This is a GeoItem, but with an additional isVisible property
export interface ItemWithVisibility extends GeoItem {
  isVisible: boolean;
}

/**
 * Serializes filters into a URL query string.
 * Intentionally avoids URL-encoding commas so the result is human-readable,
 * e.g. `types=ascent,descent` instead of `types=ascent%2Cdescent`.
 */
export function filtersToQueryString(filters: Filters): string {
  const params = new URLSearchParams();
  if (filters.query) {
    params.set('query', filters.query);
  }
  const clauses = [];
  // I want a pretty URL like `types=ascent,descent` but if we use
  // the builtin params.toString() then the `,` gets escaped into
  // `types=ascent%2Cdescent`
  if (filters.areas.size) {
    clauses.push('areas=' + Array.from(filters.areas).join(','));
  }
  if (filters.types.size) {
    clauses.push('types=' + Array.from(filters.types).join(','));
  }
  if (filters.atesRatings.size) {
    clauses.push('ates=' + Array.from(filters.atesRatings).join(','));
  }
  let clausesString = clauses.join('&');
  let queryString = params.toString();
  if (clausesString.length) {
    if (queryString.length) {
      clausesString = '&' + clausesString;
    }
    queryString = queryString + clausesString;
  }
  return queryString;
}

/**
 * Annotates each GeoItem with an `isVisible` boolean based on the current filters.
 * An item is visible if it matches all active filters (area, feature type, ATES rating, and search query).
 * The selected item is always visible regardless of filters.
 */
export function addItemVisibility(
  items: GeoItem[],
  filters: Filters,
  selectedItemId: string | undefined,
): ItemWithVisibility[] {
  const isItemVisible = (item: GeoItem): boolean => {
    if (selectedItemId && item.id === selectedItemId) {
      return true;
    }

    const matchesArea =
      item.properties.feature_type === 'area'
        ? filters.areas.size > 0 && filters.areas.has(item.id)
        : filters.areas.size == 0 || filters.areas.has(item.properties.area ?? '');
    const matchesType =
      filters.types.size == 0 || filters.types.has(item.properties.feature_type);
    const matchesAtes =
      filters.atesRatings.size == 0 ||
      item.properties.nicks_ates_ratings.length == 0 ||
      item.properties.nicks_ates_ratings.some((rating) => filters.atesRatings.has(rating));

    const terms = filters.query.toLowerCase().split(' ');
    const matchesQuery =
      terms.length === 0 ||
      terms.every((term) => item.properties.title.toLowerCase().includes(term));

    return matchesArea && matchesType && matchesAtes && matchesQuery;
  };

  return items.map((item) => ({
    ...item,
    isVisible: isItemVisible(item),
  }));
}
