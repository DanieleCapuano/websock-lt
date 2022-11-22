// Generated using webpack-cli https://github.com/webpack/webpack-cli

const path = require("path");

const isProduction = process.env.NODE_ENV == "production";

const config = [{
  entry: "./src/index.js",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "websock-lt.js",
    library: "websock-lt",
    libraryTarget: 'umd'
  },
  plugins: [
    // Add your plugins here
    // Learn more about plugins from https://webpack.js.org/configuration/plugins/
  ],
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/i,
        loader: "babel-loader",
      },
      // Add your rules for custom modules here
      // Learn more about loaders from https://webpack.js.org/loaders/
    ],
  },
}];

module.exports = () => {
  config.forEach(cfg => cfg.mode = isProduction ? "production" : 'development');
  return config;
};
