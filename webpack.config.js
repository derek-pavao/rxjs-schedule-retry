const path = require('path');

module.exports = function (env, args) {

  return {
    context: path.resolve(__dirname, 'app'),
    entry: [path.resolve(__dirname, './src/index.ts')],
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: 'index.js'
    },
    module: {
      rules: [
        {
          test: /\.ts?$/,
          use: 'ts-loader',
          exclude: /node_modules/
        }
      ]
    },
    resolve: {
      extensions: [ '.ts', '.js' ]
    }
  }
};
