const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");
module.exports = {
  mode: "development",
  entry: "./src/main.tsx",
  devtool: "inline-source-map",
  output: {
    path: path.join(__dirname, "/public/build"),
    filename: "bundle.js",
    publicPath: "/",
  },
  devtool: "inline-source-map",
  devServer: {
    static: "./public/build/",
    historyApiFallback: true,
    // contentBase: __dirname + "/public",
  },
  module: {
    rules: [
      { test: /\.jsx?$/, exclude: /node_modules/, loader: "babel-loader" },
      { test: /\.tsx?$/, use: "ts-loader", exclude: /node_modules/ },
      {
        test: /\.((sa|sc|c)ss)$/,
        use: ["style-loader", "css-loader", "sass-loader"],
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        loader: "file-loader",
      },
    ],
  },
  resolve: { extensions: [".tsx", ".ts", ".js", ".otf"] },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./public/index.html",
      // filename: "./index.html",
    }),
    new CopyPlugin({
      patterns: [
        // { from: "./src/images", to: "./images" },
        { from: "./netlify.toml", to: "./" },
        // { from: "./src/fonts", to: "./fonts" },
      ],
    }),
  ],
};
