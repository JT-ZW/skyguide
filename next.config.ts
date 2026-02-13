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
    optimizePackageImports: ['@langchain/core', '@langchain/community'],
  },
};

export default nextConfig;
