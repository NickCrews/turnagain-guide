// Generate turnagain-pass.geojson from MDX files with YAML frontmatter
// Usage: node --experimental-strip-types lib/generate-geojson.ts

// Created by Claude Sonnet 4

import { fileURLToPath } from "url";
import { readFileSync, readdirSync, writeFileSync } from "fs";
import { join } from "path";
import fm from "front-matter";

interface Frontmatter {
  id?: string;
  title?: string;
  feature_type?: string;
  area?: string;
  description?: string;
  thumbnail?: string;
  nicks_ates_ratings?: string[];
  latitude?: number;
  longitude?: number;
  distance?: number;
  elevation_min?: number;
  elevation_max?: number;
  total_ascent?: number;
  total_descent?: number;
  elevation?: number;
  geometry?: string;
  [key: string]: any;
}

interface GeoJSONGeometry {
  type: string;
  coordinates: any;
}

interface GeoJSONFeature {
  type: "Feature";
  id: string;
  properties: Record<string, any>;
  geometry: GeoJSONGeometry;
}

interface GeoJSONFeatureCollection {
  type: "FeatureCollection";
  features: GeoJSONFeature[];
}

function extractFrontmatter(content: string): [Frontmatter, string] {
  try {
    const parsed = fm(content);
    return [parsed.attributes as Frontmatter, parsed.body];
  } catch (error) {
    console.error(`Front-matter parsing error: ${error}`);
    return [{}, content];
  }
}

function generateGeoJSON(): void {
  const mdxDir = "app/routes/pages";
  const outputPath = "public/turnagain-pass.geojson";

  const features: GeoJSONFeature[] = [];

  try {
    const files = readdirSync(mdxDir)
      .filter(file => file.endsWith('.mdx'))
      .sort();

    for (const file of files) {
      const filePath = join(mdxDir, file);
      const content = readFileSync(filePath, 'utf8');

      const [frontmatter, body] = extractFrontmatter(content);

      if (Object.keys(frontmatter).length === 0) {
        console.warn(`Warning: No frontmatter found in ${file}`);
        continue;
      }

      const geojsonStr = frontmatter.geojson;
      if (!geojsonStr) {
        console.warn(`Warning: No geojson found in ${file}`);
        continue;
      }

      let geometry: GeoJSONGeometry;
      try {
        geometry = JSON.parse(geojsonStr) as GeoJSONGeometry;
      } catch {
        console.warn(`Warning: Invalid geojson JSON in ${file}:`, geojsonStr.slice(0, 100) + '...');
        continue;
      }

      const featureId = frontmatter.id || file.replace('.mdx', '');

      const properties: Record<string, any> = {};
      for (const [key, value] of Object.entries(frontmatter)) {
        if (key === 'id' || key === 'geojson') continue;
        if (value !== null && value !== "" && value !== undefined) {
          properties[key] = value;
        }
      }
      properties.mdxProse = body.trim();

      const feature: GeoJSONFeature = {
        type: "Feature",
        id: featureId,
        properties,
        geometry,
      };

      features.push(feature);
    }

    const geojson: GeoJSONFeatureCollection = {
      type: "FeatureCollection",
      features,
    };

    writeFileSync(outputPath, JSON.stringify(geojson, null, 4));

    console.log(`Generated ${outputPath} with ${features.length} features`);
  } catch (error) {
    console.error("Error generating GeoJSON:", error);
    process.exit(1);
  }
}

// If called as a script, not imported, run generateGeoJSON
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  generateGeoJSON();
}

export default generateGeoJSON;
