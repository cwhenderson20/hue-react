import webpack from 'webpack';
import path from 'path';
import ExtractTextPlugin from 'extract-text-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';

const developmentEnvironment = 'development';
const productionEnvironment = 'production';
const testEnvironment = 'test';

const getPlugins = function (env) {
  const GLOBALS = {
    'process.env.NODE_ENV': JSON.stringify(env),
    __DEV__: env === developmentEnvironment
  };

  const plugins = [
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.DefinePlugin(GLOBALS),
    new HtmlWebpackPlugin({
      template: 'client/index.html',
      filename: 'index.html',
      favicon: 'favicon.ico'
    })
  ];

  switch (env) {
    case productionEnvironment:
      plugins.push(new ExtractTextPlugin('styles.css'));
      plugins.push(new webpack.optimize.DedupePlugin());
      plugins.push(new webpack.optimize.UglifyJsPlugin({
        output: { comments: false },
        compressor: { warnings: false, screw_ie8: true }
      }));
      break;

    case developmentEnvironment:
      plugins.push(new webpack.HotModuleReplacementPlugin());
      plugins.push(new webpack.NoErrorsPlugin());
      break;
  }

  return plugins;
};

const getEntry = function (env) {
  const entry = [];

  if (env === developmentEnvironment) {
    entry.push('webpack-hot-middleware/client');
  }

  entry.push('./client/index');

  return entry;
};

const getLoaders = function (env) {
  const loaders = [{
    test: /\.jsx?$/,
    include: path.join(__dirname, 'client'),
    loaders: ['babel', 'eslint']
  }, {
    test: /\.html$/,
    include: path.join(__dirname, 'client'),
    loader: 'raw'
  }];

  if (env === productionEnvironment) {
    loaders.push({
      test: /(\.css|\.styl)$/,
      loader: ExtractTextPlugin.extract('css?sourceMap!stylus?sourceMap')
    });
  } else {
    loaders.push({
      test: /(\.css|\.styl)$/,
      loader: 'style!css?sourceMap!stylus?sourceMap'
    });
  }

  return loaders;
};

function getConfig(env) {
  return {
    debug: true,
    devtool: env === productionEnvironment ? 'source-map' : 'cheap-module-eval-source-map',
    stats: { colors: true },
    noInfo: true,
    entry: getEntry(env),
    target: env === testEnvironment ? 'node' : 'web',
    output: {
      path: `${__dirname}/dist`,
      publicPath: '',
      filename: 'bundle.js'
    },
    plugins: getPlugins(env),
    module: { loaders: getLoaders(env) }
  };
}

export default getConfig;
