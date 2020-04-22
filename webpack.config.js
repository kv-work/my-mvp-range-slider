const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const webpack = require('webpack');
const ghpages = require('gh-pages');

ghpages.publish('dist', function(err) {});

module.exports = (env = {}) => {

  const {
    mode = "development"
  } = env;

  const isProd = mode === "production";
  const isDev = mode === "development";

  //Функция для настройки loader'ов стилей
  function getStyleLoaders() {
    return [
      isProd ? MiniCssExtractPlugin.loader : 'style-loader',
      'css-loader'
    ]
  }

  //Функция для настройки подключаемых plagin'ов
  function getPlugins() {
    const plugins = [
      new HtmlWebpackPlugin({
        filename: 'index.html',
        template: './src/index.html'
      }),

      new webpack.ProvidePlugin({
        $: 'jquery',
        jQuery: 'jquery',
        'window.jQuery': 'jquery'
      })
    ];

    if (isProd) {
      plugins.push(new MiniCssExtractPlugin({
        filename: '[name].css'
      }))
    }

    return plugins
  }

  //Объект настроек
  return {

    mode,

    entry: './src/index.js',

    output: {
      filename: 'index.js'
    },

    module: {
      rules: [
        //Loading CSS
        {
          test: /\.css$/,
          use: getStyleLoaders()
        },
      ]
    },

    //Loading plugins
    plugins: getPlugins()

  }

}