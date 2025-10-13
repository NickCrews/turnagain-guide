# Turnagain Guide - Next.js Static Site

Turnagain Guide is a Next.js web application that provides a digital backcountry skiing guidebook for Turnagain Pass, Alaska. The site uses Cesium for 3D mapping, TypeScript, Tailwind CSS, and exports to a static site.

**Always reference these instructions first and fallback to search or bash commands only when you encounter unexpected information that does not match the info here.**

## Working Effectively

### Prerequisites and Installation
- Install pnpm globally: `npm install -g pnpm@10.14.0`
- The project requires Node.js LTS and uses pnpm as the package manager (specified in package.json packageManager field)
- Do NOT use `npm` or `yarn` commands. These would generate package-lock.json or yarn.lock files which are not used. Do not ever add these files to the repo.

### Bootstrap, Build, and Development Workflow
- **Install dependencies**: `pnpm install` -- takes ~25 seconds. NEVER CANCEL.
- **Lint code**: `pnpm lint` -- takes ~3 seconds. ALWAYS run before committing.
- **Build for production**: `pnpm build` -- takes ~32-40 seconds. NEVER CANCEL. Set timeout to 90+ seconds.
- **Development server**: `pnpm dev` -- starts in ~3 seconds on http://localhost:1337
- **Static server**: `pnpm serve` -- serves built static files on http://localhost:1338

### Environment Requirements and Limitations
- **Network restrictions**: Google Fonts will fail to load in restricted environments. Build may fail with font fetch errors.
  - **Workaround**: Temporarily comment out Google Fonts imports in `app/layout.tsx` if build fails
  - **Symptom**: `Failed to fetch 'Geist' from Google Fonts` error during build
- **Cesium token required**: Must set `NEXT_PUBLIC_CESIUM_ACCESS_TOKEN` environment variable for successful builds and runtime.
- **Create .env.local** for development: `echo "NEXT_PUBLIC_CESIUM_ACCESS_TOKEN=your_token_here" > .env.local`

### Build Process in Restricted Environments
If Google Fonts access is blocked:
1. **Backup current layout**: `cp app/layout.tsx app/layout.tsx.backup`
2. **Comment out font imports** in `app/layout.tsx`:
   ```typescript
   // import { Geist, Geist_Mono } from "next/font/google";
   ```
3. **Comment out font variables** and update className:
   ```typescript
   // const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
   // const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });
   
   // Update body className to: className="antialiased"
   ```
4. **Build and test**: `pnpm build && pnpm serve`
5. **Restore after testing**: `mv app/layout.tsx.backup app/layout.tsx`

## Validation and Testing

### Manual Validation Requirements
- **ALWAYS test actual functionality** after code changes, not just build success
- **Development server validation**: Start `pnpm dev` and verify http://localhost:1337 loads without errors
- **Production build validation**: Run full `pnpm build && pnpm serve` cycle and test http://localhost:1338
- **Map functionality**: The main application is a 3D map interface - verify it loads and displays terrain data
- **Route navigation**: Test clicking between different ski routes and areas
- **Mobile responsiveness**: Check layout works on different screen sizes

### Common Validation Scenarios
- **Test route linking**: Navigate between route pages (e.g., /routes/tincan-area to /routes/tincan-uptrack)
- **Verify map interactions**: Pan, zoom, and click features on the Cesium 3D map
- **Check offline capability**: The app uses service workers - test offline functionality
- **Validate static export**: Ensure all routes generate properly during `pnpm build`
- **Test with/without Cesium token**: Verify error handling when token is missing
- **Check generated files**: Confirm `public/turnagain-pass.geojson` and `public/turnagain-pass.gpx` are created
- **Verify Cesium assets**: Check that `out/Cesium/` directory contains required assets after build

## Build Process Details

### Timing Expectations
- **Dependencies install**: 25 seconds
- **Linting**: 3 seconds  
- **Development server startup**: 3 seconds
- **Production build**: 32-40 seconds (without/with fonts)
- **NEVER CANCEL** any of these operations - they must complete

### Build Artifacts
- **Output directory**: `out/` contains the static export
- **Generated files**: Build process creates `public/turnagain-pass.geojson` and `public/turnagain-pass.gpx`
- **Cesium assets**: Large Cesium library files are copied to `out/Cesium/`

## Key Codebase Architecture

### Directory Structure
```
app/                 # Next.js App Router pages and components
├── components/      # React components including Map.tsx (main Cesium map)
├── routes/          # Dynamic route pages [[...id]]/page.tsx
├── globals.css      # Global styles and CSS variables
└── layout.tsx       # Root layout with font loading

routes/              # TypeScript files defining all ski routes and areas
├── index.ts         # Exports allGeoItems array
└── *.tsx           # Individual route/area definitions

lib/                 # Utility functions
├── geo-item.ts      # Core GeoItem type definitions
├── geojson.ts       # GeoJSON processing
└── gpx.ts          # GPX file generation

components/ui/       # Reusable UI components (shadcn/ui based)
public/             # Static assets including images
```

### Important Files to Know
- **instrumentation.ts**: Runs at server startup, generates GeoJSON/GPX files from route data
- **next.config.ts**: Configures static export, Cesium webpack integration, and service worker
- **app/components/Map.tsx**: Main 3D map component using Cesium
- **app/components/ViewerContext.tsx**: Cesium viewer state management (requires CESIUM_ACCESS_TOKEN)
- **routes/index.ts**: Central export of all geographic items
- **lib/geo-item.ts**: Core type definitions for routes, areas, parking, etc.

### Data Flow
1. Route data defined in `routes/*.tsx` files as TypeScript objects
2. `instrumentation.ts` processes and exports to JSON/GPX files  
3. Map component loads and displays the geographic data using Cesium
4. Next.js static export generates all route pages at build time

## Common Tasks and Patterns

### Adding New Routes or Areas
- Create new TypeScript file in `routes/` directory
- Export `geoItem` object with proper typing from `lib/geo-item.ts`
- Add import and export to `routes/index.ts`
- Build will automatically generate pages and include in map

### Working with the Map Component
- Map uses Cesium library for 3D terrain visualization
- All geographic data is rendered as GeoJSON features
- Interactive popup system shows route details
- ALWAYS test map functionality after changes to geographic components

### Styling and UI
- Uses Tailwind CSS for styling
- Components follow shadcn/ui patterns  
- Dark/light mode support via CSS variables
- Typography configured for readability

### Static Export Considerations
- Application exports as static files (no server required)
- All routes pre-generated at build time
- Images optimized but unoptimized due to static export
- Service worker provides offline capability

## Development Workflow

### Code Quality
- **ALWAYS run `pnpm lint`** before committing - build will fail on linting errors
- TypeScript strict mode enabled
- ESLint configured with Next.js recommended rules
- Some specific rules disabled (see eslint.config.mjs)

### Testing Changes
1. Make code changes
2. Run `pnpm lint` to check for issues
3. Start development server with `pnpm dev`
4. Test functionality in browser at localhost:1337
5. Run full build cycle: `pnpm build && pnpm serve`
6. Test production build at localhost:1338
7. Verify no console errors or broken functionality

### Deployment
- Site uses static export, deployable to any static host
- GitHub Actions workflow in `.github/workflows/deploy.yml` tests builds
- Production deployed via Cloudflare (configured separately from repo)

## Troubleshooting

### Common Build Issues
- **Font loading errors**: Network restrictions preventing Google Fonts access - use workaround in "Build Process in Restricted Environments"
- **Cesium token missing**: Set NEXT_PUBLIC_CESIUM_ACCESS_TOKEN environment variable
- **TypeScript errors**: Check `lib/geo-item.ts` for proper typing of new routes
- **Import errors**: Verify new routes are properly exported from `routes/index.ts`

### Map Issues  
- **Blank map**: Usually indicates missing or invalid Cesium access token
- **Missing routes**: Check that geoItem objects are properly structured and exported
- **Performance issues**: Large Cesium assets - verify webpack configuration in next.config.ts

### Development Server Issues
- **Slow startup**: Normal for first run, subsequent starts are faster
- **Hot reload not working**: Restart development server
- **Console errors**: Check browser dev tools for client-side JavaScript errors

Remember: This is a specialized GIS application combining Next.js with 3D mapping - always verify map functionality works after making changes.