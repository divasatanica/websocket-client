const baseConfig = require('./rollup.config');

module.exports = {
    ...baseConfig,
    output: {
        file: 'dist/websocket-client.esm.js',
        format: 'esm'
    }
};