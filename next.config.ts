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
  ],
  // Webpack config for canvas dependency
  webpack: (config) => {
    config.externals = [...(config.externals || []), { canvas: 'canvas' }];
    return config;
  },
};

export default nextConfig;
