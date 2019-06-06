const TSPlugin = require('rollup-plugin-typescript2');

// rollup.config.js
module.exports = {
    input: 'src/index.ts',
    output: {
      file: 'dist/websocket-client.js',
      format: 'es'
    },
    plugins: [
        TSPlugin({
          typescript: require('typescript')
        })
    ]
  };