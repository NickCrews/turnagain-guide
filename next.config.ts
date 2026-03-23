import CopyWebpackPlugin from 'copy-webpack-plugin';
import path from 'path';
import { NextConfig } from 'next';
import process from 'process';

console.log(`Running Next.js in ${process.env.NODE_ENV} mode`);

const basicConfig: NextConfig = {
  // Next.js config options

  // make a static website for prod, allow server features in dev
  output: process.env.NODE_ENV === 'production' ? 'export' : 'standalone',

  // For a static website, we can't use a dynamincally optimized <Image>
  // components. Explicitly opt out of the optimization.
  images: {
    unoptimized: true,
  },

  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },

  // include markdown and MDX files
  pageExtensions: ['js', 'jsx', 'md', 'ts', 'tsx'],

  // configure webpack to work with Cesium
  webpack: (config, { webpack, isServer }) => {
    console.log("Using production stub for ProdStub", config.resolve.alias);
    if (process.env.NODE_ENV === 'production') {
      config.resolve.alias = {
        ...config.resolve.alias,
        '@/stub-in-prod/stub': path.join(__dirname, 'src/stub-in-prod/_prod.tsx'),
        '*/stub-in-prod': path.join(__dirname, 'src/stub-in-prod/_prod.tsx'),
      };
    } else {
      config.resolve.alias = {
        ...config.resolve.alias,
        '@/stub-in-prod/stub': path.join(__dirname, 'src/stub-in-prod/_dev.tsx'),
        '*/stub-in-prod': path.join(__dirname, 'src/stub-in-prod/_dev.tsx'),
      };
    }

    if (!isServer) {
      config.plugins.push(
        new CopyWebpackPlugin({
          patterns: [
            {
              from: path.join(__dirname, 'node_modules/cesium/Build/Cesium/Workers'),
              to: path.join(__dirname, 'public/Cesium/Workers')
            },
            {
              from: path.join(__dirname, 'node_modules/cesium/Build/Cesium/ThirdParty'),
              to: path.join(__dirname, 'public/Cesium/ThirdParty'),
            },
            {
              from: path.join(__dirname, 'node_modules/cesium/Build/Cesium/Assets'),
              to: path.join(__dirname, 'public/Cesium/Assets'),
            },
            {
              from: path.join(__dirname, 'node_modules/cesium/Build/Cesium/Widgets'),
              to: path.join(__dirname, 'public/Cesium/Widgets'),
            },
          ],
        })
      )
    }
    config.plugins.push(
      new webpack.DefinePlugin({
        CESIUM_BASE_URL: JSON.stringify('/Cesium'),
      }),
    );
    return config;
  },
}

export default basicConfig;
