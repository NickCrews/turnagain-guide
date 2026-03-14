function latLonToSlippy(lat: number, lon: number, zoom: number) {
    // from https://gis.stackexchange.com/a/461861/125638
    // and https://wiki.openstreetmap.org/wiki/Slippy_map_tilenames#Pseudo-code
    const n = 2 ** zoom;
    const r = lat * Math.PI / 180;
    const lts = Math.log(Math.tan(r) + 1 / Math.cos(r));
    const x = n * (0.5 + lon / 360);
    const y = n * (1 - lts / Math.PI) / 2;
    // console.log({ lat, lon, x, y, n, r, lts });
    return { x, y };

}
interface Bounds {
    lat1: number;
    lon1: number;
    lat2: number;
    lon2: number;
}

function boundsToSlippys(bounds: Bounds, zoom: number) {
    const { lat1, lon1, lat2, lon2 } = bounds;
    const { x: x1, y: y1 } = latLonToSlippy(lat1, lon1, zoom);
    const { x: x2, y: y2 } = latLonToSlippy(lat2, lon2, zoom);
    const xmin = Math.floor(Math.min(x1, x2));
    const xmax = Math.floor(Math.max(x1, x2));
    const ymin = Math.floor(Math.min(y1, y2));
    const ymax = Math.floor(Math.max(y1, y2));
    const results = [];
    for (let x = xmin; x <= xmax; x++) {
        for (let y = ymin; y <= ymax; y++) {
            results.push({ x, y });
        }
    }
    return results;
}

function slippysInBounds(bounds: Bounds, maxZoom: number) {
    const results = [];
    for (let zoom = 0; zoom <= maxZoom; zoom++) {
        for (const slippy of boundsToSlippys(bounds, zoom)) {
            results.push({ zoom, ...slippy });
        }
    }
    return results;
}

/**
 * The URL template for the World Imagery tile server.
 */
export const WORLD_IMAGERY_URL_TEMPLATE = "https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}";

/**
 * Generates URLs for tiles of the Turnagain Pass area using the specified maximum zoom level.
 * 
 * @param maxZoom The maximum zoom level to generate tiles for.
 * @param urlTemplate The URL template to use for the tiles. Defaults to the World Imagery tile server.
 *    example: https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}
 */
export function turnagainPassTileUrls(maxZoom: number, urlTemplate: string | undefined = WORLD_IMAGERY_URL_TEMPLATE) {
    const bounds = { lat1: 60.7024, lon1: -149.2939, lat2: 60.85644, lon2: -149.02529 };
    const results = slippysInBounds(bounds, maxZoom).map(
        ({ zoom, x, y }) => {
            return {
                url: urlTemplate.replace("{z}", zoom.toString()).replace("{x}", x.toString()).replace("{y}", y.toString()),
                revision: null,
            };
        }
    );
    return results;
}