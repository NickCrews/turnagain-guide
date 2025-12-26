# AGENTS.md for turnagain.guide

## Setup commands
- We use `pnpm`, do NOT use `npm`.
- Install deps: `pnpm install`
- Start dev server: `pnpm dev`
 
## Code style
- TypeScript strict mode
- Single quotes
- Use functional patterns where possible
- Minimal comments. Only when WHY is needed, not for WHAT or HOW.

## Testing instructions
- Run tests: `pnpm test`
- To focus on one step, add the Vitest pattern: `pnpm test run -t "<test name>"`.
- Fix any test or type errors until the whole suite is green.
- After moving files or changing imports, run `pnpm lint --filter <project_name>` to be sure ESLint and TypeScript rules still pass.
- Add or update tests for the code you change, even if nobody asked.
 
## PR instructions
- Always run `pnpm lint` and `pnpm test` before committing.