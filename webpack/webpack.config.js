const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
  mode: "production",
  entry: {
    highlighting: path.resolve(__dirname, "..", "src", "highlighting.ts"),
    stundenanzeige: path.resolve(__dirname, "..", "src", "stundenanzeige.ts"),
    stundenerfassung: path.resolve(__dirname, "..", "src", "stundenerfassung.ts"),
  },
  output: {
    path: path.join(__dirname, "../dist"),
    filename: "[name].js",
  },
  resolve: {
    extensions: [".ts", ".js"],
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: "ts-loader",
        exclude: /node_modules/,
      },
    ],
  },
  plugins: [
    new CopyPlugin({
      patterns: [{ from: ".", to: ".", context: "public" }]
    }),
  ],
};