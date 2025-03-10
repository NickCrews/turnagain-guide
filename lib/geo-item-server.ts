/**
 * This module uses fs, so it needs to be walled off somewhere where the bundler
 * won't try to use it on the client.
 */
import { GeoItemCollection } from './geo-item';
import { promises as fs } from 'fs';

export async function loadGeoItemCollection(filePath: string | null = null) {
    if (filePath === null) {
        filePath = process.cwd() + '/public/turnagain-pass.geojson';
    }
    const geojson = await fs.readFile(filePath, 'utf8');
    return (await GeoItemCollection.fromGeoJson(geojson));
}