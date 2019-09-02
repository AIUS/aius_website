const path = require('path');

module.exports = (_env, _options) => ({
  mode: 'production',
  devtool: 'source-map',

  resolve: {
    extensions: ['.ts', '.tsx', '.js'],
  },

  output: {
    filename: 'app.js',
    path: path.resolve(__dirname, '../priv/static/js')
  },

  module: {
    rules: [
      {
        test: /\.ts(x?)$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'ts-loader',
          },
        ],
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        }
      },
      {
        enforce: 'pre',
        test: /\.js$/,
        loader: 'source-map-loader',
      },
    ],
  },
});
