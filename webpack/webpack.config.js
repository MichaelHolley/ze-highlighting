const path = require("node:path");
const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
  mode: "production",
  entry: {
    highlighting: path.resolve(__dirname, "..", "src", "highlighting.ts"),
    popup: path.resolve(__dirname, "..", "src", "popup.ts"),
    tweaks: path.resolve(__dirname, "..", "src", "tweaks.ts")
  },
  output: {
    path: path.join(__dirname, "../dist"),
    filename: "[name].js"
  },
  resolve: {
    extensions: [".ts", ".js"]
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
      patterns: [{ from: ".", to: ".", context: "public" }],
    }),
  ],
};
