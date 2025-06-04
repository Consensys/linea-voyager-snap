import { merge, type SnapConfig } from '@metamask/snaps-cli';
import { resolve } from 'path';

const config: SnapConfig = {
  input: resolve(__dirname, 'src/index.ts'),
  server: {
    port: 8080,
  },
  polyfills: {
    buffer: true,
  },
  customizeWebpackConfig: (webpackConfig) =>
    merge(webpackConfig, {
      module: {
        rules: [
          {
            test: /\.svg$/u,
            type: 'asset/source',
          },
        ],
      },
    }),
};

export default config;
