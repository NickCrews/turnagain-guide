// WARNING: If you edit this file, you MUST restart the dev server with `pnpm dev`
// in order to see the new changes reflected in the browser.
//
// Other things to try:
// - clear the cache of stored files by going to the Application tab in the DevTools,
//   going to the "Storage" section (the top-level one underneath "Service workers",
//   not the ones split by type like IndexedDB, Local Storage, etc.), and clicking
//   "Clear site data".
// - In the "Service workers" section of the Application tab, check the "Update on reload"
//   not quite sure what this does, but it might be needed to get the fresh version?
// - In the "Service workers" section of the Application tab, check the "Offline"
//   checkbox after the initial load to simulate being offline.

import { defaultCache } from "@serwist/next/worker";
import type { PrecacheEntry, SerwistGlobalConfig } from "serwist";
import { Serwist } from "serwist";

import {turnagainPassTileUrls, WORLD_IMAGERY_URL_TEMPLATE} from "../util/tiles";

// This declares the value of `injectionPoint` to TypeScript.
// `injectionPoint` is the string that will be replaced by the
// actual precache manifest. By default, this string is set to
// `"self.__SW_MANIFEST"`.
declare global {
  interface WorkerGlobalScope extends SerwistGlobalConfig {
    __SW_MANIFEST: (PrecacheEntry | string)[] | undefined;
  }
}

declare const self: ServiceWorkerGlobalScope;

const serwist = new Serwist({
  precacheEntries: self.__SW_MANIFEST,
  precacheOptions: {
    concurrency: 64,
  },
  skipWaiting: true,
  clientsClaim: true,
  navigationPreload: true,
  runtimeCaching: defaultCache,
  fallbacks: {
    entries: [
      {
        url: "/offline",
        matcher({ request }) {
          return request.destination === "document";
        },
      },
    ],
  },
});

function addTilesToPrecache() {
  // Zooming to more gives diminishing returns
  // and really slows down the requests, and increases the size of the cache,
  // since at each zoom level, the number of tiles increases by a factor of 4.
  // By default, serwist precaches everything on the "install" event.
  // This means that the serviceworker isn't activated until all the tiles are downloaded.
  // If you go to the Console tab in the DevTools, you can see:
  // ...
  // serwist Service worker is installing...
  // serwist Precaching 310 files.
  // serwist Registered service worker installed.
  // ...
  // Therefore we want this to be moderately fast.
  //
  // These satellite imagery tiles, at zoom level 14, take about 5MB, which took ~15 seconds
  // on my mobile hotspot in Girdwood.
  // See https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/14/4689/1401
  // for an example of the resolution at zoom level 14.
  const tileUrls = turnagainPassTileUrls(14, WORLD_IMAGERY_URL_TEMPLATE);
  console.log(`Adding ${tileUrls.length} tiles to background fetch`);  // 310 at zoom 14
  serwist.addToPrecacheList(tileUrls);
}

addTilesToPrecache();

serwist.addEventListeners();