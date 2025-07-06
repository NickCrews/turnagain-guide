/**
 * This module uses fs, so it needs to be walled off somewhere where the bundler
 * won't try to use it on the client.
 */
import path from 'path';
import { promises as fs } from 'fs';
import { GeoItem, GeoItemProperties, addChildrenField } from './geo-item';
import { type Geometry } from 'geojson';
import { evaluate } from "next-mdx-remote-client/rsc";

async function getMDXFiles(dir: string) {
  return (await fs.readdir(dir)).filter((file) => path.extname(file) === '.mdx').map((file) => path.join(dir, file));
}

async function readMDXFile(filePath: string): Promise<GeoItem> {
  const rawContent = await fs.readFile(filePath, 'utf-8')
  
  // Serialize the MDX content for client-side rendering
  const {content: mdxJsx, frontmatter, error} = await evaluate({
    source: rawContent,
    options:{
      parseFrontmatter: true, // We already parsed frontmatter with front-matter
    },
    components: {},
  });
  if (error) {
    throw new Error(`Error parsing MDX file ${filePath}: ${error.message}`);
  }
  const {id, geojson: geojsonString, ...rawProperties} = frontmatter as any;
  if (!id) {
    throw new Error(`MDX file ${filePath} is missing an 'id' frontmatter attribute.`);
  }
  if (!geojsonString) {
    throw new Error(`MDX file ${filePath} is missing a 'geojson' frontmatter attribute.`);
  }
  if (typeof geojsonString !== 'string') {
    throw new Error(`MDX file ${filePath} has an invalid 'geojson' frontmatter attribute. Expected a string.`);
  }
  rawProperties['nicks_ates_ratings'] = rawProperties['nicks_ates_ratings'] || [];
  

  
  return {
    type: 'Feature',
    id,
    geometry: JSON.parse(geojsonString) as Geometry,
    mdxJsx,
    properties: {
      ...rawProperties
    } as GeoItemProperties,
  };
}

async function getMDXs(dir: string) {
  const mdxFiles = await getMDXFiles(dir);
  const raw = await Promise.all(mdxFiles.map(readMDXFile));
  const withChildren = addChildrenField(raw);
  return withChildren;
}

export async function loadGeoItems() {
  const dir = process.cwd() + '/app/routes/pages';
  const items = await getMDXs(dir);
  console.log("Loaded " + items.length + " geoitems");
  // for (const item of items) {
  //   console.log(JSON.stringify(item, null, 2));
  // }
  return items;
}