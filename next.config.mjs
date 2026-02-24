import { withPayload } from '@payloadcms/next/withPayload'

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Keep heavy packages external so they are not bundled into the serverless trace
  serverExternalPackages: ['sharp', 'mongoose'],
  // Exclude dev/test/build deps and build artifacts from serverless bundle (Vercel 250 MB limit)
  outputFileTracingExcludes: {
    '/*': [
      // Build cache and store must not be traced (api/media/serve/[id] was 1.1 GB due to these)
      '.next/cache/**',
      '.pnpm-store/**',
      '.next/trace/**',
      'node_modules/playwright/**',
      'node_modules/playwright-core/**',
      'node_modules/@playwright/**',
      'node_modules/vitest/**',
      'node_modules/@vitest/**',
      'node_modules/jsdom/**',
      'node_modules/typescript/**',
      'node_modules/@types/**',
      'node_modules/eslint/**',
      'node_modules/eslint-config-next/**',
      'node_modules/@eslint/**',
      'node_modules/prettier/**',
      'node_modules/vite/**',
      'node_modules/@vitejs/**',
      'node_modules/vite-tsconfig-paths/**',
      'node_modules/tsx/**',
      'node_modules/@testing-library/**',
      'node_modules/jest/**',
      'node_modules/jest-environment-jsdom/**',
    ],
    // API routes serve JSON only; exclude admin UI bundle (saves significant MB)
    '/api/*': ['node_modules/@payloadcms/ui/**'],
  },
  webpack: (webpackConfig) => {
    webpackConfig.resolve.extensionAlias = {
      '.cjs': ['.cts', '.cjs'],
      '.js': ['.ts', '.tsx', '.js', '.jsx'],
      '.mjs': ['.mts', '.mjs'],
    }

    return webpackConfig
  },
}

export default withPayload(nextConfig, { devBundleServerPackages: false })
