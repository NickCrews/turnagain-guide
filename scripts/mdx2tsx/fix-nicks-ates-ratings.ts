#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ROUTES_DIR = path.join(__dirname, '..', 'routes');
const MDX_DIR = path.join(__dirname, '..', 'app', 'routes', 'pages');

function extractNicksAtesRatingsFromMdx(mdxContent: string): string[] {
  const frontmatterMatch = mdxContent.match(/^---\s*\n([\s\S]*?)\n---/);
  if (!frontmatterMatch) {
    return [];
  }

  const yamlContent = frontmatterMatch[1];
  
  // Find the nicks_ates_ratings section
  const ratingsMatch = yamlContent.match(/nicks_ates_ratings:\s*\n((?:\s*-\s*.+\n?)*)/);
  if (!ratingsMatch) {
    return [];
  }

  // Extract the array items
  const ratingsSection = ratingsMatch[1];
  const ratings = ratingsSection
    .split('\n')
    .map(line => line.trim())
    .filter(line => line.startsWith('-'))
    .map(line => line.substring(1).trim())
    .filter(Boolean);

  return ratings;
}

function updateTsxNicksAtesRatings(tsxPath: string, ratings: string[]): void {
  const tsxContent = fs.readFileSync(tsxPath, 'utf-8');
  
  // Replace "nicks_ates_ratings: []" with the actual ratings
  const ratingsString = JSON.stringify(ratings);
  
  const updatedContent = tsxContent.replace(
    /nicks_ates_ratings:\s*\[\]/,
    `nicks_ates_ratings: ${ratingsString}`
  );

  fs.writeFileSync(tsxPath, updatedContent);
}

function fixNicksAtesRatings(): void {
  const tsxFiles = fs.readdirSync(ROUTES_DIR)
    .filter(file => file.endsWith('.tsx'))
    .filter(file => file !== 'index.ts');

  let fixedCount = 0;

  for (const tsxFile of tsxFiles) {
    const tsxPath = path.join(ROUTES_DIR, tsxFile);
    const tsxContent = fs.readFileSync(tsxPath, 'utf-8');
    
    // Check if nicks_ates_ratings is empty
    if (!tsxContent.includes('nicks_ates_ratings: []')) {
      continue;
    }

    console.log(`Checking ratings for ${tsxFile}...`);

    // Find corresponding MDX file
    const mdxFile = tsxFile.replace('.tsx', '.mdx');
    const mdxPath = path.join(MDX_DIR, mdxFile);
    
    if (!fs.existsSync(mdxPath)) {
      console.warn(`MDX file not found: ${mdxPath}`);
      continue;
    }

    const mdxContent = fs.readFileSync(mdxPath, 'utf-8');
    const ratings = extractNicksAtesRatingsFromMdx(mdxContent);
    
    if (ratings.length === 0) {
      console.log(`No ratings found in ${mdxFile}, skipping`);
      continue;
    }

    updateTsxNicksAtesRatings(tsxPath, ratings);
    fixedCount++;
    console.log(`✓ Fixed ratings for ${tsxFile}: [${ratings.join(', ')}]`);
  }

  console.log(`\nFixed nicks_ates_ratings for ${fixedCount} files.`);
}

fixNicksAtesRatings();
