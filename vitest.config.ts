import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
  resolve: {
    tsconfigPaths: true,
  },
  // The figures registry is a .tsx module (figure descriptions contain JSX),
  // and the pure selectors we test live alongside it. tsconfig sets
  // `jsx: "preserve"` for Next.js, so we need the React plugin to transform JSX
  // for the test transform pipeline.
  plugins: [react()],
  test: {
    environment: 'node',
    include: ['src/**/*.{test,spec}.{ts,tsx}'],
  },
})
