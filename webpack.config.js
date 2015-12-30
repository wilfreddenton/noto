var path = require('path')
,   webpack = require('webpack')
,   HtmlWebpackPlugin = require('html-webpack-plugin')
,   ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
  entry: [
    'webpack-dev-server/client?http://localhost:3999',
    'webpack/hot/only-dev-server',
    './src/index.js',
  ],
  output: {
    filename: 'bundle.js',
    path: path.join(__dirname, 'dist'),
    publicPath: '/assets/'
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin(),
    new ExtractTextPlugin('bundle.css', { allChunks: true }),
    new HtmlWebpackPlugin({
      title: 'nōto',
      filename: 'index.html',
      template: 'index.template.html',
      favicon: path.join(__dirname, 'assets', 'images', 'favicon.png')
    })
  ],
  module: {
    loaders: [
      { test: /\.(css|scss)$/, exclude: /node_modules/, loader: ExtractTextPlugin.extract('style', 'css?modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]!sass') },
      { test: /\.js$/, exclude: /node_modules/, loaders: ['react-hot', 'babel'] }
    ]
  }
}

