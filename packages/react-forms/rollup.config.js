const nxRollupConfig = require('@nrwl/react/plugins/bundle-rollup');
const { terser } = require('rollup-plugin-terser');

module.exports = function getRollupOptions(options) {
  const nxOptions = nxRollupConfig(options);
  return {
    ...nxOptions,
    plugins: [...(nxOptions.plugins || []), terser()],
    external: [
      'react',
      'react-dom',
      '@heetch/flamingo-react',
      '@react-hook/window-size',
      'react-hook-form',
    ],
  };
};
