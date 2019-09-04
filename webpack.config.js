var path = require('path')
var webpack = require('webpack')
var PrerenderSpaPlugin = require('prerender-spa-plugin')
var CopyWebpackPlugin = require('copy-webpack-plugin')

module.exports = {
  entry: {
    app: [
      'babel-polyfill',
      './src/main.js'
    ]
  },
  output: {
    path: path.resolve(__dirname, './dist'),
    publicPath: '/dist/',
    filename: 'build.js'
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
          loaders: {
          }
          // other vue-loader options go here
        }
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/
      },
      {
        test: /\.(png|jpg|gif|svg)$/,
        loader: 'file-loader',
        options: {
          name: '[name].[ext]?[hash]'
        }
      }
    ]
  },
  plugins: [
    new CopyWebpackPlugin([
      { from: 'src/static' },
    ]),
    new PrerenderSpaPlugin(
      path.join(__dirname, 'dist'),
      ['/', '/products/1', '/products/2', '/products/3']
    )
  ],
  devServer: {
    contentBase: path.resolve(__dirname, './dist'), // A directory or URL to serve HTML content from
    historyApiFallback: true, // fallback to /index.html for single Page Applications.
    inline: true// inline mode(set to false to disable including client scripts, like livereload)
  },
  devtool: 'eval-source-map',// enable devtool for better debugging experience
  resolve: {
    alias: {
      'vue$': 'vue/dist/vue.esm.js'
    }
  },
  performance: {
    hints: false
  },
}

if (process.env.NODE_ENV === 'production') {
  module.exports.devtool = '#source-map'
  // http://vue-loader.vuejs.org/en/workflow/production.html
  module.exports.plugins = (module.exports.plugins || []).concat([
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"production"'
      }
    }),
    new webpack.optimize.UglifyJsPlugin({
      sourceMap: true,
      compress: {
        warnings: false
      }
    }),
    new webpack.LoaderOptionsPlugin({
      minimize: true
    })
  ])
}
