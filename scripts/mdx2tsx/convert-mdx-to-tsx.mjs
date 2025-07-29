#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const MDX_DIR = path.join(__dirname, '../app/routes/pages');
const OUTPUT_DIR = path.join(__dirname, '../routes');

function parseFrontmatter(content) {
  const frontmatterMatch = content.match(/^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/);
  if (!frontmatterMatch) {
    return { frontmatter: {}, mdxContent: content };
  }

  const [, yamlContent, mdxContent] = frontmatterMatch;
  const frontmatter = {};
  
  // Simple YAML parser for our specific format
  const lines = yamlContent.split('\n');
  let currentKey = null;
  let multilineValue = '';
  let inMultiline = false;

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;

    if (inMultiline) {
      if (trimmed.startsWith('-') || (currentKey && line.match(/^[a-zA-Z_]/))) {
        // End multiline, process next key
        frontmatter[currentKey] = multilineValue.trim();
        inMultiline = false;
        multilineValue = '';
        currentKey = null;
      } else {
        multilineValue += line + '\n';
        continue;
      }
    }

    if (trimmed.includes(': >-')) {
      // Start of multiline value
      currentKey = trimmed.split(':')[0].trim();
      inMultiline = true;
      multilineValue = '';
    } else if (trimmed.includes(': ')) {
      // Simple key-value pair
      const [key, ...valueParts] = trimmed.split(': ');
      let value = valueParts.join(': ').trim();
      
      // Handle arrays
      if (value === '' && lines[lines.indexOf(line) + 1]?.trim().startsWith('-')) {
        // This is an array, collect following items
        const arrayItems = [];
        let nextLineIndex = lines.indexOf(line) + 1;
        while (nextLineIndex < lines.length && lines[nextLineIndex]?.trim().startsWith('-')) {
          arrayItems.push(lines[nextLineIndex].trim().substring(1).trim());
          nextLineIndex++;
        }
        frontmatter[key.trim()] = arrayItems;
      } else {
        // Try to parse as number if it looks like one
        if (!isNaN(value) && !isNaN(parseFloat(value))) {
          frontmatter[key.trim()] = parseFloat(value);
        } else {
          frontmatter[key.trim()] = value;
        }
      }
    } else if (trimmed.startsWith('-') && currentKey) {
      // Array item
      if (!frontmatter[currentKey]) {
        frontmatter[currentKey] = [];
      }
      frontmatter[currentKey].push(trimmed.substring(1).trim());
    }
  }

  // Handle final multiline value
  if (inMultiline && currentKey) {
    frontmatter[currentKey] = multilineValue.trim();
  }

  return { frontmatter, mdxContent: mdxContent.trim() };
}

function generateGeometry(geojsonString) {
  if (!geojsonString) return null;
  
  try {
    const geojson = JSON.parse(geojsonString);
    return geojson;
  } catch (e) {
    console.warn('Failed to parse geojson:', e.message);
    return null;
  }
}

function toCamelCase(str) {
  return str.replace(/-([a-z])/g, (g) => g[1].toUpperCase());
}

function generateTsxContent(frontmatter, mdxContent, filename) {
  const id = frontmatter.id || path.basename(filename, '.mdx');
  const camelCaseId = toCamelCase(id);
  
  // Build properties object
  const properties = {
    title: frontmatter.title || '',
    feature_type: frontmatter.feature_type || '',
    thumbnail: frontmatter.thumbnail || '',
    nicks_ates_ratings: frontmatter.nicks_ates_ratings || [],
    children: [],
  };

  // Add optional properties if they exist
  if (frontmatter.area) properties.area = frontmatter.area;
  if (frontmatter.elevation !== undefined) properties.elevation = frontmatter.elevation;
  if (frontmatter.elevation_max !== undefined) properties.elevation_max = frontmatter.elevation_max;
  if (frontmatter.elevation_min !== undefined) properties.elevation_min = frontmatter.elevation_min;
  if (frontmatter.distance !== undefined) properties.distance = frontmatter.distance;
  if (frontmatter.latitude !== undefined) properties.latitude = frontmatter.latitude;
  if (frontmatter.longitude !== undefined) properties.longitude = frontmatter.longitude;
  if (frontmatter.total_descent !== undefined) properties.total_descent = frontmatter.total_descent;

  const geometry = generateGeometry(frontmatter.geojson);

  // Convert basic MDX content to JSX (basic paragraph wrapping)
  let jsxContent = mdxContent;
  
  // Split by double newlines to identify paragraphs
  const paragraphs = jsxContent.split(/\n\s*\n/).filter(p => p.trim());
  
  // Wrap non-component paragraphs in <p> tags
  const wrappedParagraphs = paragraphs.map(paragraph => {
    const trimmed = paragraph.trim();
    
    // Skip if it's already a component (starts with <)
    if (trimmed.startsWith('<')) {
      return `      ${trimmed}`;
    }
    
    // Skip import statements
    if (trimmed.startsWith('import ')) {
      return null;
    }
    
    // Wrap in paragraph tags
    return `      <p>
        ${trimmed.replace(/\n/g, '\n        ')}
      </p>`;
  }).filter(Boolean);

  const proseJsx = wrappedParagraphs.length > 0 
    ? wrappedParagraphs.join('\n\n') 
    : '      {/* Add content here */}';

  // Generate import statements for images (basic detection)
  const imageImports = [];
  const importRegex = /import\s+(\w+)\s+from\s+['"]([^'"]+)['"]/g;
  let match;
  while ((match = importRegex.exec(mdxContent)) !== null) {
    imageImports.push(`import ${match[1]} from '${match[2]}';`);
  }

  // Check for Figure and Link usage
  const needsFigure = mdxContent.includes('<Figure');
  const needsLink = mdxContent.includes('<Link') || mdxContent.includes('Link href');

  const imports = [
    ...(needsFigure ? ["import Figure from '@/app/components/Figure';"] : []),
    ...(needsLink ? ["import Link from '@/components/ui/link';"] : []),
    ...imageImports,
    "import { type GeoItem } from '@/lib/geo-item';"
  ];

  return `${imports.join('\n')}

export const geoItem: GeoItem = {
  id: "${id}",
  type: "Feature",
  geometry: ${geometry ? JSON.stringify(geometry, null, 4).replace(/"/g, '"') : 'null'},
  properties: ${JSON.stringify(properties, null, 4)},
  proseJsx: <>
${proseJsx}
    </>
};`;
}

function convertMdxToTsx() {
  // Ensure output directory exists
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  const mdxFiles = fs.readdirSync(MDX_DIR).filter(file => file.endsWith('.mdx'));
  const indexImports = [];
  const indexExports = [];

  for (const mdxFile of mdxFiles) {
    const mdxPath = path.join(MDX_DIR, mdxFile);
    const tsxFile = mdxFile.replace('.mdx', '.tsx');
    const tsxPath = path.join(OUTPUT_DIR, tsxFile);
    
    // Skip if TSX already exists
    if (fs.existsSync(tsxPath)) {
      console.log(`Skipping ${mdxFile} - TSX already exists`);
      continue;
    }

    console.log(`Converting ${mdxFile} -> ${tsxFile}`);

    const mdxContent = fs.readFileSync(mdxPath, 'utf-8');
    const { frontmatter, mdxContent: content } = parseFrontmatter(mdxContent);
    
    const tsxContent = generateTsxContent(frontmatter, content, mdxFile);
    fs.writeFileSync(tsxPath, tsxContent);

    // Prepare index.ts updates
    const id = frontmatter.id || path.basename(mdxFile, '.mdx');
    const camelCaseId = toCamelCase(id);
    const moduleId = tsxFile.replace('.tsx', '');
    
    indexImports.push(`import { geoItem as ${camelCaseId} } from './${moduleId}';`);
    indexExports.push(`  ${camelCaseId},`);
  }

  // Update index.ts if new files were created
  if (indexImports.length > 0) {
    console.log('\\nUpdating routes/index.ts...');
    const indexPath = path.join(OUTPUT_DIR, 'index.ts');
    
    if (fs.existsSync(indexPath)) {
      let indexContent = fs.readFileSync(indexPath, 'utf-8');
      
      // Add new imports
      const importSection = indexContent.match(/^(import.*?\n)+/m);
      if (importSection) {
        const existingImports = importSection[0];
        const newImports = indexImports.filter(imp => !existingImports.includes(imp));
        if (newImports.length > 0) {
          indexContent = existingImports + newImports.join('\n') + '\n' + 
                        indexContent.substring(existingImports.length);
        }
      }
      
      // Add new exports
      const exportMatch = indexContent.match(/export const allGeoItems = \[(.*?)\];/s);
      if (exportMatch) {
        const existingExports = exportMatch[1];
        const newExportItems = indexExports.filter(exp => !existingExports.includes(exp.trim()));
        if (newExportItems.length > 0) {
          const updatedExports = existingExports.trim() + 
                                (existingExports.trim() ? ',\n' : '') + 
                                newExportItems.join('\n');
          indexContent = indexContent.replace(
            /export const allGeoItems = \[(.*?)\];/s,
            `export const allGeoItems = [\n${updatedExports}\n];`
          );
        }
      }
      
      fs.writeFileSync(indexPath, indexContent);
    }
  }

  console.log('\\nConversion complete! Remember to manually fix:');
  console.log('- External links → <a href="">');
  console.log('- Internal links → <Link href="">'); 
  console.log('- Images → <Figure src={ImportedImage} caption={<>...</>} />');
  console.log('- Complex JSX formatting');
}

convertMdxToTsx();
