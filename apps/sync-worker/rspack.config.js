const { NxAppRspackPlugin } = require('@nx/rspack/app-plugin');
const { join } = require('node:path');

module.exports = {
  output: {
    path: join(__dirname, '../../dist/apps/sync-worker'),
  },
  plugins: [
    new NxAppRspackPlugin({
      target: 'node',
      main: './src/main.ts',
      tsConfig: './tsconfig.app.json',
      optimization: false,
      outputHashing: 'none',
      typeCheckOptions: { async: false },
      generatePackageJson: true,
      assets: ['./src/assets'],
    }),
  ],
};
