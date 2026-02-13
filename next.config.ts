import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  // Mark packages as external to prevent build issues
  serverExternalPackages: [
    '@chroma-core/default-embed',
    'chromadb',
    '@langchain/core',
    '@langchain/community',
    '@langchain/textsplitters',
    'langchain',
    'pdf-parse',
    'onnxruntime-node',
    'sharp',
    '@huggingface/transformers',
  ],
  // Exclude heavy packages from serverless function tracing
  outputFileTracingExcludes: {
    '/api/**': [
      'node_modules/onnxruntime-node/**',
      'node_modules/@img/sharp-libvips-linuxmusl-x64/**',
      'node_modules/@img/sharp-libvips-linux-x64/**',
      'node_modules/@huggingface/transformers/**',
      'node_modules/sharp/**',
      'node_modules/@xenova/**',
      'node_modules/transformers/**',
    ],
  },
  // Aggressive webpack config to reduce bundle size
  webpack: (config, { isServer }) => {
    if (isServer) {
      // Externalize heavy dependencies for serverless functions
      config.externals = [
        ...config.externals,
        'onnxruntime-node',
        'sharp',
        '@huggingface/transformers',
        'transformers',
        '@xenova/transformers',
        'canvas',
        'pdf-parse',
      ];
    }
    return config;
  },
  // Optimize for production
  experimental: {
    serverMinification: true,
  },
};

export default nextConfig;
