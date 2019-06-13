const baseConfig = require('./rollup.config');

module.exports = {
    ...baseConfig,
    output: {
        file: 'dist/websocket-client.iife.js',
        format: 'iife',
        name: 'WebsocketClient'
    }
};