import withSerwistInit from '@serwist/next';
import CopyWebpackPlugin from 'copy-webpack-plugin';
import path from 'path';
import { NextConfig } from 'next';
import createMDX from '@next/mdx';

const basicConfig: NextConfig = {
  // Next.js config options

  // make a static website
  output: 'export',
  
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
  pageExtensions: ['js', 'jsx', 'md', 'mdx', 'ts', 'tsx'],

  // configure webpack to work with Cesium
  webpack: (config, { webpack, isServer }) => {
    if (!isServer) {
      config.plugins.push(
        new CopyWebpackPlugin({
          patterns: [
            {
              from: path.join(
                __dirname,
                'node_modules/cesium/Build/Cesium/Workers'
              ),
              to: '../public/Cesium/Workers',
            },
            {
              from: path.join(
                __dirname,
                'node_modules/cesium/Build/Cesium/ThirdParty'
              ),
              to: '../public/Cesium/ThirdParty',
            },
            {
              from: path.join(
                __dirname,
                'node_modules/cesium/Build/Cesium/Assets'
              ),
              to: '../public/Cesium/Assets',
            },
            {
              from: path.join(
                __dirname,
                'node_modules/cesium/Build/Cesium/Widgets'
              ),
              to: '../public/Cesium/Widgets',
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

const withSerwist = withSerwistInit({
  swSrc: 'app/sw.ts',
  swDest: 'public/sw.js',
  // The cesium assets are large, so we need to increase the cache limit
  maximumFileSizeToCacheInBytes: 5 * 1024 ** 2, // 5 MB
  reloadOnOnline: false,
});

const withMDX = createMDX({
  // Add markdown plugins here, as desired

})

export default withSerwist(withMDX(basicConfig));
