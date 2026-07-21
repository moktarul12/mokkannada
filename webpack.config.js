// Learn more https://docs.expo.io/guides/customizing-webpack
const createExpoWebpackConfigAsync = require('@expo/webpack-config');
const path = require('path');

module.exports = async function (env, argv) {
  const config = await createExpoWebpackConfigAsync(env, argv);

  // Always serve local web at http://localhost:1900
  config.devServer = {
    ...config.devServer,
    port: 1900,
    host: 'localhost',
  };

  // Resolve @env for web (react-native-dotenv is Metro/babel-oriented)
  config.resolve = config.resolve || {};
  config.resolve.alias = {
    ...(config.resolve.alias || {}),
    '@env': path.resolve(__dirname, 'config/env.js'),
  };

  // Inject .env into process.env for the web build
  try {
    // eslint-disable-next-line global-require
    require('dotenv').config({ path: path.resolve(__dirname, '.env') });
  } catch (e) {
    // dotenv optional — values can still be set in the shell
  }

  const webpack = require('webpack');
  config.plugins = config.plugins || [];
  config.plugins.push(
    new webpack.DefinePlugin({
      'process.env.AUTH0_DOMAIN': JSON.stringify(process.env.AUTH0_DOMAIN || ''),
      'process.env.AUTH0_CLIENT_ID': JSON.stringify(process.env.AUTH0_CLIENT_ID || ''),
      'process.env.AUTH0_AUDIENCE': JSON.stringify(process.env.AUTH0_AUDIENCE || ''),
      'process.env.APP_NAME': JSON.stringify(process.env.APP_NAME || 'KannadaSpeakingApp'),
      'process.env.APP_ENV': JSON.stringify(process.env.APP_ENV || 'development'),
    })
  );

  // Add SVG support for web
  config.module.rules.push({
    test: /\.svg$/,
    use: [
      {
        loader: '@svgr/webpack',
        options: {
          svgoConfig: {
            plugins: [
              {
                name: 'removeViewBox',
                active: false,
              },
            ],
          },
        },
      },
    ],
  });

  return config;
};
