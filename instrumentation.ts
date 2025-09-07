import { allGeoItems } from "./routes";
import gpxFromGeojson from "./lib/gpx";
import geojsonFromGeoItems from "./lib/geojson";

// This is called once during nextjs server startup.
// https://nextjs.org/docs/app/guides/instrumentation
export async function register() {
  console.log("Running instrumentation.ts");
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    const geojson = geojsonFromGeoItems(allGeoItems);
    const gpx = gpxFromGeojson(geojson);
    const { writeFileSync } = await import("fs");
    writeFileSync("public/turnagain-pass.geojson", JSON.stringify(geojson, null, 4));
    writeFileSync("public/turnagain-pass.gpx", JSON.stringify(gpx, null, 4));
    console.log("Wrote public/turnagain-pass.geojson and public/turnagain-pass.gpx");
  }
}