const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const ghpages = require('gh-pages');

ghpages.publish('dist');

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
        template: './demo/demo.html',
      }),
    ];

    if (isProd) {
      plugins.push(new MiniCssExtractPlugin({
        moduleFilename: ({ name }) => {
          const chunkName = name.replace('/js/', '/css/');
          if (chunkName === 'lib') {
            return 'lib/my-mvp-range-slider.min.css';
          }
          return 'styles.css';
        },
      }));
    }

    return plugins;
  }

  // Объект настроек
  return {

    mode,

    entry: {
      lib: './src/plugin/plugin.ts',
      demo: './demo/demo.ts',
    },

    output: {
      filename: ({ chunk }) => {
        if (chunk.name === 'lib') {
          return 'lib/my-mvp-range-slider.min.js';
        }
        return 'index.js';
      },
      library: 'my-mvp-range-slider',
      libraryTarget: 'umd',
      umdNamedDefine: true,
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
