const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const webpack = require('webpack');
// const ghpages = require('gh-pages');

// ghpages.publish('dist');

module.exports = (env = {}) => {
  const { mode = 'development' } = env;

  const isProd = mode === 'production';

  // Функция для настройки loader'ов стилей
  function getStyleLoaders() {
    return [
      isProd ? MiniCssExtractPlugin.loader : 'style-loader',
      'css-loader',
    ];
  }

  // Функция для настройки подключаемых plagin'ов
  function getPlugins() {
    const plugins = [
      new HtmlWebpackPlugin({
        filename: 'index.html',
        template: './src/demo/index.html',
      }),

      new webpack.ProvidePlugin({
        $: 'jquery',
        jQuery: 'jquery',
        'window.jQuery': 'jquery',
      }),
    ];

    if (isProd) {
      plugins.push(new MiniCssExtractPlugin({
        filename: '[name].css',
      }));
    }

    return plugins;
  }

  // Объект настроек
  return {

    mode,

    entry: {
      'demo': './src/demo/index.ts',
      'plugin': './src/plugin/plugin.ts',
    },

    output: {
      // path: ({chunk}) => chunk.name === 'demo' ? 'dist' : 'lib',
      filename: ({chunk}) => chunk.name === 'demo' ? 'index.js' : 'my-mvp-range-slider.min.js',
      library: 'my-mvp-range-slider',
      libraryTarget: 'umd',
      umdNamedDefine: true,
    },

    resolve: {
      extensions: ['.ts', '.js'],
    },

    // devtool: 'inline-source-map',

    module: {
      // Loading TypeScript files
      rules: [
        {
          test: /\.ts$/,
          use: 'ts-loader',
          exclude: /node_modules/,
        },

        // Loading CSS
        {
          test: /\.css$/,
          use: getStyleLoaders(),
        },
      ],
    },

    // Loading plugins
    plugins: getPlugins(),

  };
};
