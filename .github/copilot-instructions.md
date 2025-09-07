# Turnagain.guide - Backcountry Skiing Guide

Always reference these instructions first and fallback to search or bash commands only when you encounter unexpected information that does not match the info here.

## Working Effectively

### Initial Setup and Build
- Install pnpm globally: `npm install -g pnpm`
- Install dependencies: `pnpm install` -- takes 30 seconds. Set timeout to 60+ seconds.
- **CRITICAL**: Next.js builds require environment variables to work properly:
  - Set `NEXT_PUBLIC_CESIUM_ACCESS_TOKEN=dummy` for builds (real token needed for production)
  - **Google Fonts Network Issue**: Builds WILL FAIL in restricted network environments due to Google Fonts fetch failures. To fix:
    1. Comment out Google Font imports in `app/layout.tsx` (lines 2, 9-17)
    2. Change body className to use system fonts instead
    3. Restore fonts after build validation in unrestricted environments
- Build the application: `NEXT_PUBLIC_CESIUM_ACCESS_TOKEN=dummy pnpm build` -- takes 70 seconds. NEVER CANCEL. Set timeout to 120+ minutes.
- **NETWORK WORKAROUND**: If build fails with Google Fonts errors, temporarily remove font imports from `app/layout.tsx`

### Development Server
- Start development server: `NEXT_PUBLIC_CESIUM_ACCESS_TOKEN=dummy pnpm dev`
- Access at: http://localhost:3000 (redirects to /routes)
- Server starts in 3-5 seconds

### Linting and Code Quality
- Run linting: `pnpm lint` -- takes 3 seconds but FAILS with several errors (this is known)
- Known linting issues (not required to fix):
  - Missing React Hook dependencies in Map.tsx
  - Image optimization warnings in RouteCard.tsx and RouteDetail.tsx
  - TypeScript strict mode violations in lib/ files
- ESLint skips linting during builds (`ignoreDuringBuilds: true`)

### Python Scripts and Data Management
- Python scripts require `uv` package manager: Install via `curl -LsSf https://astral.sh/uv/install.sh | sh`
- Run MDX migration script: `uv run scripts/migrate-metadata-to-mdx.py`
- **NOTE**: Python scripts may fail in restricted network environments due to dependency downloads

## Validation and Testing

### Application Functionality Testing
- **ALWAYS** test complete user scenarios after making changes:
  1. Navigate to http://localhost:3000 - should redirect to /routes
  2. Verify route list loads with 40+ skiing routes
  3. Click on a route card (e.g., "Blue Diamond Route") to test detail view
  4. Verify 3D Cesium map loads (may show errors in restricted networks but should display terrain)
  5. Test filtering by Area, Type, and Terrain using dropdown filters
  6. Verify route navigation and back button functionality

### Known Network Limitations
- Cesium map tiles fail to load in restricted network environments (shows errors but app still functions)
- Google Fonts fail to load during builds in restricted networks
- External imagery services may be blocked but core functionality remains intact

### Manual Validation Scenarios
- **Route Browsing**: Filter routes by area (e.g., "Tincan Area"), verify results update
- **Route Details**: Click route cards to view detailed information, images, and descriptions  
- **Map Interaction**: Test map navigation (pan, zoom, rotate) using mouse controls
- **Responsive Design**: Test on different screen sizes using browser dev tools

## Architecture and Key Components

### Application Structure
- **Next.js 15** with App Router and static site generation (`output: 'export'`)
- **MDX** for route content with YAML frontmatter
- **Cesium** for 3D mapping and terrain visualization
- **Tailwind CSS** for styling with custom components
- **Service Worker** with Serwist for offline functionality

### Important Directories
- `app/` - Next.js app router pages and components
- `routes/` - MDX route content files
- `components/` - Reusable UI components  
- `lib/` - Utilities for geo data processing
- `public/` - Static assets and generated files
- `scripts/` - Python data processing scripts

### Key Files to Understand
- `app/layout.tsx` - Root layout with fonts and providers
- `app/routes/[[...id]]/page.tsx` - Dynamic route pages
- `next.config.ts` - Cesium webpack configuration
- `lib/geo-item.ts` - Core geo data loading and processing
- `components/ui/` - shadcn/ui component library

### Build Configuration
- **Static Export**: Generates static HTML/CSS/JS for deployment
- **Cesium Assets**: Webpack copies Cesium assets to public directory during build
- **Image Optimization**: Disabled for static builds (`unoptimized: true`)
- **Service Worker**: Generated at `public/sw.js` with precaching

## Common Workflows

### Adding New Routes
1. Create new MDX file in appropriate area directory under `routes/`
2. Include YAML frontmatter with metadata (area, type, terrain, etc.)
3. Run development server to test route appears in list
4. Verify route detail page loads correctly

### Modifying Map or UI Components  
1. Edit components in `app/components/` or `components/ui/`
2. Test changes with development server
3. **ALWAYS** verify Cesium map functionality after changes
4. Test responsive behavior on different screen sizes

### Working with Geo Data
- Route data loaded from MDX files via `loadGeoItems()` function
- GeoJSON and GPX files generated during build process
- Python scripts process and collate geographic data

### Deployment Preparation
- Build must complete successfully: `NEXT_PUBLIC_CESIUM_ACCESS_TOKEN=dummy pnpm build`
- Verify all routes load in production build
- Test offline functionality with service worker
- Ensure all static assets are properly included

## Troubleshooting

### Build Failures
- **Font Loading (COMMON)**: Builds fail with "Failed to fetch Geist from Google Fonts" in restricted networks
  - **FIX**: Temporarily comment out font imports in `app/layout.tsx`:
    - Comment lines 2: `import { Geist, Geist_Mono } from "next/font/google";`
    - Comment lines 9-17: Font configuration objects  
    - Change body className to: `className="antialiased font-sans"`
    - Restore fonts after validating build works
- **Cesium Token**: Always set `NEXT_PUBLIC_CESIUM_ACCESS_TOKEN` environment variable
- **Memory Issues**: Build process can be memory intensive, ensure adequate resources

### Development Issues  
- **Map Not Loading**: Check Cesium token and network connectivity
- **Route Not Found**: Verify MDX file exists and has proper frontmatter
- **Component Errors**: Check for TypeScript errors in component files

### Network Restrictions
- Application works with limited network access
- External map tiles and fonts may fail but core functionality remains
- Use dummy tokens and local fallbacks for restricted environments

## Performance Notes
- Initial page load processes 40 geo items
- Build time approximately 70 seconds with full static generation
- Development server starts quickly (3-5 seconds)
- Linting completes in 3 seconds despite known issues