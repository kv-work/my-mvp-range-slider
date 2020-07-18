const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const webpack = require('webpack');
const path = require('path');
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
    const plugins = [];

    if (isProd) {
      plugins.push(new MiniCssExtractPlugin({
        filename: 'my-mvp-range-slider.min.css',
      }));
    }

    return plugins;
  }

  // Объект настроек
  return {

    mode,

    entry: './src/plugin/plugin.ts',

    output: {
      path: path.resolve(__dirname, 'dist', 'lib'),
      filename: 'my-mvp-range-slider.min.js',
    },

    resolve: {
      extensions: ['.ts', '.js'],
    },

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
        {
          // Expose jQuery
          test: require.resolve('jquery'),
          loader: 'expose-loader',
          options: {
            exposes: ['$', 'jQuery'],
          },
        },
      ],
    },

    // Loading plugins
    plugins: getPlugins(),

  };
};
