const { NxAppRspackPlugin } = require('@nx/rspack/app-plugin');
const { join } = require('node:path');

module.exports = {
  output: {
    path: join(__dirname, '../../dist/apps/api'),
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
      assets: [{ glob: '**/*', input: 'libs/backend/translate/assets', output: 'assets' }],
    }),
    (compiler) => {
      const swcRule = compiler.options.module.rules.find((rule) => rule?.loader === 'builtin:swc-loader');
      if (!swcRule) {
        throw new Error('Expected NxAppRspackPlugin to configure the SWC loader.');
      }
      // Nest GraphQL distinguishes arrow type factories from constructors by their prototype.
      swcRule.options.jsc.target = 'es2021';
    },
  ],
};
