module.exports = {
  entry: {
    'dweb-serviceworker': './dweb-serviceworker.js',
    'dweb-serviceworker-boot': './dweb-serviceworker-boot.js',
    'dweb-serviceworker-proxy': './dweb-serviceworker-proxy.js'
  },
  output: {
    filename: '[name]-bundle.js',
    path: __dirname + '/dist'
  },
    node: {
        fs: 'empty',
        net: 'empty',
        tls: 'empty',
        crypto: 'empty',
        process: true,
        module: false,
        clearImmediate: false,
        Buffer: true,
        setImmediate: false,
        console: false
    },

    resolve: {
        alias: {
            zlib: 'browserify-zlib-next'
        }
    }
}
