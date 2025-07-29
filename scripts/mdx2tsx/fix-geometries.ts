#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ROUTES_DIR = path.join(__dirname, '..', 'routes');
const MDX_DIR = path.join(__dirname, '..', 'app', 'routes', 'pages');

interface GeoJSON {
  type: string;
  coordinates: number[][] | number[][][] | number[][][][];
}

function extractGeojsonFromMdx(mdxContent: string): GeoJSON | null {
  const frontmatterMatch = mdxContent.match(/^---\s*\n([\s\S]*?)\n---/);
  if (!frontmatterMatch) {
    return null;
  }

  const yamlContent = frontmatterMatch[1];
  
  // Find the geojson section that starts with "geojson: >-"
  const geojsonMatch = yamlContent.match(/geojson:\s*>-\s*\n([\s\S]*?)(?=\n\w+:|$)/);
  if (!geojsonMatch) {
    return null;
  }

  // Clean up the geojson string - remove leading whitespace from each line
  const geojsonString = geojsonMatch[1]
    .split('\n')
    .map(line => line.replace(/^\s{2,}/, '')) // Remove leading whitespace
    .join('\n')
    .trim();

  try {
    return JSON.parse(geojsonString);
  } catch (error) {
    console.error('Failed to parse geojson:', error);
    return null;
  }
}

function updateTsxGeometry(tsxPath: string, geometry: GeoJSON): void {
  const tsxContent = fs.readFileSync(tsxPath, 'utf-8');
  
  // Replace any existing geometry with the actual geometry
  const geometryString = JSON.stringify(geometry, null, 2)
    .split('\n')
    .map((line, index) => index === 0 ? line : '  ' + line) // Indent subsequent lines
    .join('\n');
  
  // Match geometry: followed by anything until properties: {
  const updatedContent = tsxContent.replace(
    /geometry:\s*(?:null|{[\s\S]*?}),?\s*properties:\s*{/,
    `geometry: ${geometryString},\n  properties: {`
  );

  fs.writeFileSync(tsxPath, updatedContent);
}

function fixGeometries(): void {
  const tsxFiles = fs.readdirSync(ROUTES_DIR)
    .filter(file => file.endsWith('.tsx'))
    .filter(file => file !== 'index.ts');

  let fixedCount = 0;

  for (const tsxFile of tsxFiles) {
    const tsxPath = path.join(ROUTES_DIR, tsxFile);
    
    console.log(`Processing geometry for ${tsxFile}...`);

    // Find corresponding MDX file
    const mdxFile = tsxFile.replace('.tsx', '.mdx');
    const mdxPath = path.join(MDX_DIR, mdxFile);
    
    if (!fs.existsSync(mdxPath)) {
      console.warn(`MDX file not found: ${mdxPath}`);
      continue;
    }

    const mdxContent = fs.readFileSync(mdxPath, 'utf-8');
    const geometry = extractGeojsonFromMdx(mdxContent);
    
    if (!geometry) {
      console.warn(`No valid geometry found in ${mdxFile}`);
      continue;
    }

    updateTsxGeometry(tsxPath, geometry);
    fixedCount++;
    console.log(`✓ Updated geometry for ${tsxFile}`);
  }

  console.log(`\nUpdated geometry for ${fixedCount} files.`);
}

fixGeometries();
