const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");

// Try the environment variable, otherwise use localhost
const AUTH_SERVER = process.env.AUTH_SERVER || 'https://127.0.0.1:3500';

try {
  require("os").networkInterfaces();
} catch (e) {
  require("os").networkInterfaces = () => ({});
}

module.exports = {
  entry: [
    "@babel/polyfill",
    "react-hot-loader/patch",
    "webpack/hot/only-dev-server", // "only" prevents reload on syntax errors
    "./src/index.js",
  ],
  devtool: "source-map",
  output: {
    path: path.join(__dirname, "dist"),
    filename: "bundle.js",
    publicPath: "/",
  },
  devServer: {
    port: 8080,
    https: true,
    disableHostCheck: true,
    host: "0.0.0.0",
    historyApiFallback: true,
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        loaders: ["babel-loader"],
        exclude: /node_modules/,
        include: path.resolve(__dirname),
      },
      {
        test: /\.css$/,
        loaders: ["style-loader", "css-loader"],
      },
      {
        test: /.jsx?$/,
        loaders: ["babel-loader"],
        exclude: /node_modules/,
        include: path.resolve(__dirname),
      },
      {
        test: /.less$/,
        loader: "style-loader!css-loader!less-loader",
      },
      {
        test: /\.mp3$/,
        loader: "file-loader",
        options: {
          name: "sounds/[name].[ext]",
        },
      },
      {
        test: /\.woff(\?v=\d+\.\d+\.\d+)?$/,
        loader: "url-loader?limit=10000&mimetype=application/font-woff",
        options: {
          name: "fonts/[name].[ext]",
        },
      },
      {
        test: /\.woff2(\?v=\d+\.\d+\.\d+)?$/,
        loader: "url-loader?limit=10000&mimetype=application/font-woff",
        options: {
          name: "fonts/[name].[ext]",
        },
      },
      {
        test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
        loader: "url-loader?limit=10000&mimetype=application/octet-stream",
        options: {
          name: "fonts/[name].[ext]",
        },
      },
      {
        test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
        loader: "file-loader",
        options: {
          name: "fonts/[name].[ext]",
        },
      },
      {
        test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
        loader: "url-loader?limit=10000&mimetype=image/svg+xml",
        options: {
          name: "images/[name].[ext]",
        },
      },
      {
        test: /\.(jpg|jpeg|gif|png)$/,
        loader: "url-loader?limit=65000&name=images/[name].[ext]",
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        loader: "file-loader",
      },
    ],
  },
  plugins: [
    new webpack.DefinePlugin({
      "process.env": {
        NODE_ENV: `""`,
        AUTH_SERVER: JSON.stringify(AUTH_SERVER),
      },
    }),
    new CopyWebpackPlugin([
      { from: "./src/static", ignore: ["*.html"] },
      "./public/manifest.json",
    ]),
    new HtmlWebpackPlugin({
      inject: true,
      template: "./public/index.html",
      js: process.env.ELECTRON ? ["renderer.js"] : [],
    }),
    new webpack.NoEmitOnErrorsPlugin(),
  ],
};
